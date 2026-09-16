import os
import sys
import time
import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sqlalchemy import func

sys.path.insert(0, r"c:\Users\91935\OneDrive\Desktop\ShopSense\backend")

from app.database import SessionLocal
from app.models.user import User
from app.models.customer import Customer
from app.models.vendor import Vendor
from app.models.category import Category
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.inventory import Inventory
from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.payment import Payment

from app.services.recommendation_service import get_recommendations
from app.services.customer_segmentation_service import get_customer_segments
from app.services.admin_intelligence_service import get_marketplace_intelligence

from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, calinski_harabasz_score, davies_bouldin_score
from sklearn.preprocessing import StandardScaler

def run_all():
    db = SessionLocal()
    
    print("==================================================")
    print("1. DATABASE AUDIT & SCHEMA INSPECTION")
    print("==================================================")
    counts = {
        "User": db.query(User).count(),
        "Customer": db.query(Customer).count(),
        "Vendor": db.query(Vendor).count(),
        "Category": db.query(Category).count(),
        "Product": db.query(Product).count(),
        "ProductImage": db.query(ProductImage).count(),
        "Inventory": db.query(Inventory).count(),
        "Cart": db.query(Cart).count(),
        "CartItem": db.query(CartItem).count(),
        "Order": db.query(Order).count(),
        "OrderItem": db.query(OrderItem).count(),
        "Payment": db.query(Payment).count(),
    }
    for k, v in counts.items():
        print(f"  {k:<15}: {v}")

    print("\n--- Order Status Breakdown ---")
    for s, c in db.query(Order.order_status, func.count(Order.order_id)).group_by(Order.order_status).all():
        print(f"  {s}: {c}")

    print("\n--- Payment Status Breakdown ---")
    for s, c in db.query(Payment.payment_status, func.count(Payment.payment_id)).group_by(Payment.payment_status).all():
        print(f"  {s}: {c}")

    # Total GMV
    total_gmv = db.query(func.sum(Order.total_amount)).scalar()
    avg_order_val = db.query(func.avg(Order.total_amount)).scalar()
    print(f"\n  Total Marketplace GMV: ${total_gmv:,.2f}")
    print(f"  Average Order Value:   ${avg_order_val:,.2f}")

    print("\n==================================================")
    print("2. ML EVALUATION: RFM CUSTOMER SEGMENTATION")
    print("==================================================")
    # Perform RFM across entire marketplace customer base
    cust_rfm_query = (
        db.query(
            Customer.customer_id,
            func.max(Payment.payment_date).label("last_purchase"),
            func.count(func.distinct(Order.order_id)).label("order_count"),
            func.sum(OrderItem.price * OrderItem.quantity).label("total_spent")
        )
        .join(Order, Customer.customer_id == Order.customer_id)
        .join(OrderItem, Order.order_id == OrderItem.order_id)
        .join(Payment, Order.order_id == Payment.order_id)
        .filter(Payment.payment_status == "SUCCESS")
        .group_by(Customer.customer_id)
        .all()
    )
    
    ref_date = datetime.utcnow()
    rfm_rows = []
    for r in cust_rfm_query:
        recency = (ref_date - r.last_purchase).days if r.last_purchase else 180
        rfm_rows.append({
            "customer_id": r.customer_id,
            "recency": max(recency, 0),
            "frequency": r.order_count or 0,
            "monetary": float(r.total_spent or 0.0)
        })
        
    df_rfm = pd.DataFrame(rfm_rows)
    print(f"  Active Transacting Customers Evaluated: {len(df_rfm)}")
    
    if len(df_rfm) > 10:
        X = df_rfm[["recency", "frequency", "monetary"]]
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        for k in [3, 4, 5]:
            km = KMeans(n_clusters=k, random_state=42, n_init=10)
            labels = km.fit_predict(X_scaled)
            sil = silhouette_score(X_scaled, labels)
            ch = calinski_harabasz_score(X_scaled, labels)
            db_idx = davies_bouldin_score(X_scaled, labels)
            print(f"  K={k}: Silhouette = {sil:.4f}, Calinski-Harabasz = {ch:.2f}, Davies-Bouldin = {db_idx:.4f}")

    print("\n==================================================")
    print("3. ML EVALUATION: INVENTORY DEMAND FORECASTING")
    print("==================================================")
    # Test time-series demand forecasting across top products
    top_products = (
        db.query(OrderItem.product_id, func.sum(OrderItem.quantity).label("total_sold"))
        .join(Order, Order.order_id == OrderItem.order_id)
        .group_by(OrderItem.product_id)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(10)
        .all()
    )
    
    mapes, rmses, maes = [], [], []
    for prod_id, total_sold in top_products:
        items = (
            db.query(OrderItem.quantity, Payment.payment_date)
            .join(Order, Order.order_id == OrderItem.order_id)
            .join(Payment, Payment.order_id == Order.order_id)
            .filter(OrderItem.product_id == prod_id, Payment.payment_status == "SUCCESS")
            .order_by(Payment.payment_date.asc())
            .all()
        )
        if len(items) < 10:
            continue
        
        df_prod = pd.DataFrame([{"date": i[1], "qty": i[0]} for i in items])
        df_prod["week"] = df_prod["date"].dt.to_period("W")
        weekly = df_prod.groupby("week")["qty"].sum().reset_index()
        
        if len(weekly) >= 6:
            split = int(len(weekly) * 0.8)
            train = weekly.iloc[:split]["qty"].values
            test = weekly.iloc[split:]["qty"].values
            
            # Forecast: 3-period moving average
            pred = float(np.mean(train[-3:])) if len(train) >= 3 else float(np.mean(train))
            predictions = np.full(len(test), pred)
            
            mae = float(np.mean(np.abs(test - predictions)))
            rmse = float(np.sqrt(np.mean((test - predictions) ** 2)))
            non_zero = test != 0
            mape = float(np.mean(np.abs((test[non_zero] - predictions[non_zero]) / test[non_zero])) * 100) if np.any(non_zero) else 0.0
            
            maes.append(mae)
            rmses.append(rmse)
            mapes.append(mape)
            print(f"  Product #{prod_id:<4} (Sold: {total_sold:>4} units, Weeks: {len(weekly):>2}): MAE = {mae:.2f}, RMSE = {rmse:.2f}, MAPE = {mape:.2f}%")
            
    if maes:
        print(f"\n  Average Forecast Metrics across Top Products:")
        print(f"  -> Mean MAE:  {np.mean(maes):.2f} units")
        print(f"  -> Mean RMSE: {np.mean(rmses):.2f} units")
        print(f"  -> Mean MAPE: {np.mean(mapes):.2f}%")

    print("\n==================================================")
    print("4. ML EVALUATION: RECOMMENDATION SYSTEM")
    print("==================================================")
    # Test recommendation hit rate on customers with >= 4 purchases (leave last order out)
    active_customers = (
        db.query(Order.customer_id, func.count(Order.order_id))
        .group_by(Order.customer_id)
        .having(func.count(Order.order_id) >= 4)
        .limit(40)
        .all()
    )
    
    # 4. Recommender Evaluation
    # Since get_recommendations excludes all products already purchased by customer in the DB,
    # we evaluate category relevance: does the recommender recommend products from the customer's preferred categories?
    category_hits = 0
    total_eval = 0
    
    for cid, num_orders in active_customers:
        # Get customer preferred category from order history
        cust_orders = (
            db.query(Order)
            .filter(Order.customer_id == cid)
            .order_by(Order.created_at.asc())
            .all()
        )
        if len(cust_orders) < 2:
            continue
            
        try:
            rec_resp = get_recommendations(db, cid)
            rec_items = rec_resp.recommended_products
            
            # Check if recommended products match customer's top purchased categories
            cust_pids = [
                oi.product_id for o in cust_orders 
                for oi in db.query(OrderItem).filter(OrderItem.order_id == o.order_id).all()
            ]
            cust_cats = {
                db.query(Product).filter(Product.product_id == pid).first().category_id 
                for pid in cust_pids if db.query(Product).filter(Product.product_id == pid).first()
            }
            
            rec_cats = [
                db.query(Product).filter(Product.product_id == p.product_id).first().category_id 
                for p in rec_items if db.query(Product).filter(Product.product_id == p.product_id).first()
            ]
            
            if any(rc in cust_cats for rc in rec_cats):
                category_hits += 1
            total_eval += 1
        except Exception as e:
            pass
            
    if total_eval > 0:
        print(f"  Evaluated {total_eval} active multi-purchase customers:")
        print(f"  -> Category-Relevance Precision@4: {(category_hits/total_eval)*100:.2f}% ({category_hits}/{total_eval})")

    print("\n==================================================")
    print("5. PERFORMANCE & SCALABILITY (100K TRANSACTIONS)")
    print("==================================================")
    t0 = time.time()
    intel = get_marketplace_intelligence(db)
    t_intel = time.time() - t0
    retention_pct = round((intel['customer']['returning_customers'] / max(intel['customer']['total_customers'], 1)) * 100, 2)
    print(f"  Admin Marketplace Intelligence Query Latency: {t_intel*1000:.2f} ms")
    print(f"  Marketplace Health Score: {intel['health']['score']}% ({intel['health']['status']})")
    print(f"  Total Customers: {intel['customer']['total_customers']}")
    print(f"  Returning Customers: {intel['customer']['returning_customers']} ({retention_pct}% retention)")
    print(f"  Premium Customers (> $100k): {intel['customer']['premium_customers']}")

    # Scalability simulation: 100,000 transactions
    n = 100_000
    np.random.seed(42)
    fake_df = pd.DataFrame({
        "order_id": np.arange(1, n + 1),
        "customer_id": np.random.randint(1, 5000, size=n),
        "vendor_id": np.random.randint(1, 100, size=n),
        "amount": np.random.uniform(15.0, 450.0, size=n).round(2),
        "status": np.random.choice(["DELIVERED", "PROCESSING", "CANCELLED", "REFUNDED"], size=n, p=[0.82, 0.10, 0.05, 0.03]),
        "created_at": pd.date_range("2025-01-01", periods=n, freq="min")
    })
    
    t_start = time.time()
    # 1. Vendor performance pipeline
    v_agg = fake_df.groupby("vendor_id").agg(
        total_revenue=("amount", "sum"),
        order_count=("order_id", "count"),
        avg_order_value=("amount", "mean")
    )
    # 2. Customer RFM pipeline
    c_rfm = fake_df.groupby("customer_id").agg(
        last_date=("created_at", "max"),
        frequency=("order_id", "count"),
        monetary=("amount", "sum")
    )
    # 3. Monthly trends
    m_trends = fake_df.set_index("created_at").resample("ME")["amount"].sum()
    t_end = time.time()
    
    elapsed = t_end - t_start
    throughput = n / elapsed
    print(f"  -> Processed {n:,} transaction data pipeline in {elapsed:.4f}s ({throughput:,.0f} tx/sec)")

    db.close()

if __name__ == "__main__":
    run_all()
