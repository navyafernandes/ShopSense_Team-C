from datetime import datetime

import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.payment import Payment
from app.models.user import User
from app.models.vendor import Vendor

from app.schemas.customer_segmentation_schema import CustomerSegmentationResponse
from app.ml.tracker import MLTracker

def get_customer_segments(db: Session, current_user: User):

    vendor = (
        db.query(Vendor)
        .filter(Vendor.user_id == current_user.user_id)
        .first()
    )


    if not vendor:
        return CustomerSegmentationResponse(
           total_customers=0,
           premium_customers=0,
           regular_customers=0,
           new_customers=0,
           inactive_customers=0,
           silhouette_score=0.0,
           customers=[]
        )

    customer_data = (
        db.query(
            Customer.customer_id,
            User.full_name,
            func.sum(
                OrderItem.price * OrderItem.quantity
            ).label("total_spent"),
            func.count(
                func.distinct(Order.order_id)
            ).label("order_count"),
            func.max(
                Payment.payment_date
            ).label("last_purchase")
        )
        .join(User, Customer.user_id == User.user_id)
        .join(Order, Customer.customer_id == Order.customer_id)
        .join(OrderItem, Order.order_id == OrderItem.order_id)
        .join(Payment, Order.order_id == Payment.order_id)
        .filter(
            OrderItem.vendor_id == vendor.vendor_id,
            Payment.payment_status == "SUCCESS"
        )
        .group_by(
            Customer.customer_id,
            User.full_name
        )
        .all()
    )


    if not customer_data:
        return CustomerSegmentationResponse(
           total_customers=0,
           premium_customers=0,
           regular_customers=0,
           new_customers=0,
           inactive_customers=0,
           silhouette_score=0.0,
           customers=[]
        )

    rows = []
    today = datetime.utcnow()

    for customer in customer_data:

        total_spent = float(customer.total_spent or 0)

        order_count = customer.order_count or 0

        average_order_value = (
            total_spent / order_count
            if order_count > 0
            else 0
        )

        recency_days = (
            (today - customer.last_purchase.replace(tzinfo=None)).days
            if customer.last_purchase
            else 0
        )

        rows.append({
            "customer_id": customer.customer_id,
            "customer_name": customer.full_name,
            "total_spent": total_spent,
            "order_count": order_count,
            "average_order_value": average_order_value,
            "recency_days": recency_days
        })

    df = pd.DataFrame(rows)

    # ----------------------------
    # Feature Selection
    # ----------------------------
    features = df[
        [
            "total_spent",
            "order_count",
            "average_order_value",
            "recency_days"
        ]
    ]

    # ----------------------------
    # Feature Scaling
    # ----------------------------
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features)

    # ----------------------------
    # Determine number of clusters
    # ----------------------------
    if len(df) >= 4:
      n_clusters = 4
    elif len(df) == 3:
     n_clusters = 3
    elif len(df) == 2:
     n_clusters = 2
    else:
     n_clusters = 1

    if n_clusters < 2:
     customers = []

     for _, row in df.iterrows():
        customers.append({
            "customer_id": int(row["customer_id"]),
            "customer_name": row["customer_name"],
            "total_spent": float(row["total_spent"]),
            "order_count": int(row["order_count"]),
            "average_order_value": float(row["average_order_value"]),
            "recency_days": int(row["recency_days"]),
            "segment": "New"
        })

     return CustomerSegmentationResponse(
        total_customers=len(df),
        premium_customers=0,
        regular_customers=0,
        new_customers=len(df),
        inactive_customers=0,
        silhouette_score=0.0,
        customers=customers
    )

    # ----------------------------
    # Train KMeans
    # ----------------------------
    kmeans = KMeans(
        n_clusters=n_clusters,
        random_state=42,
        n_init=10
    )

    clusters = kmeans.fit_predict(scaled_features)

    df["cluster"] = clusters

    # ----------------------------
    # Evaluate Clustering
    # ----------------------------
    unique_clusters = len(set(clusters))

    if unique_clusters > 1 and unique_clusters < len(df):
      score = silhouette_score(
          scaled_features,
          clusters
      )
    else:
       score = 0.0
    
    # ----------------------------
    # Map clusters to business segments
    # ----------------------------
    cluster_summary = (
      df.groupby("cluster")
      .agg({
         "total_spent": "mean",
         "order_count": "mean",
         "recency_days": "mean"
      })
    )

    # Higher spending and more orders are better.
    # Lower recency (more recent purchase) is better.
    cluster_summary["rfm_score"] = (
       cluster_summary["total_spent"] * 0.5 +
       cluster_summary["order_count"] * 0.3 -
       cluster_summary["recency_days"] * 0.2
    )

    cluster_summary = cluster_summary.sort_values(
       by="rfm_score",
       ascending=False
    )

    cluster_order = cluster_summary.index.tolist()

    segment_names = [
        "Premium",
        "Regular",
        "New",
        "Inactive"
    ]

    cluster_mapping = {}

    for i, cluster in enumerate(cluster_order):
        if i < len(segment_names):
            cluster_mapping[cluster] = segment_names[i]
        else:
            cluster_mapping[cluster] = "Regular"

    df["segment"] = df["cluster"].map(cluster_mapping)

    premium_count = (df["segment"] == "Premium").sum()
    regular_count = (df["segment"] == "Regular").sum()
    new_count = (df["segment"] == "New").sum()
    inactive_count = (df["segment"] == "Inactive").sum()

    customers = []

    for _, row in df.iterrows():

        customers.append({
            "customer_id": int(row["customer_id"]),
            "customer_name": row["customer_name"],
            "total_spent": float(row["total_spent"]),
            "order_count": int(row["order_count"]),
            "average_order_value": float(row["average_order_value"]),
            "recency_days": int(row["recency_days"]),
            "segment": row["segment"]
        })

    # Log ML experiment run
    MLTracker.log_experiment(
        experiment_name="Customer_RFM_KMeans_Segmentation",
        parameters={
            "vendor_id": vendor.vendor_id,
            "n_clusters": n_clusters,
            "features": ["total_spent", "order_count", "average_order_value", "recency_days"],
            "model": "KMeans(n_init=10, random_state=42)"
        },
        metrics={
            "total_customers": len(df),
            "silhouette_score": round(float(score), 3),
            "premium_customers": int(premium_count),
            "regular_customers": int(regular_count),
            "new_customers": int(new_count),
            "inactive_customers": int(inactive_count)
        }
    )

    return CustomerSegmentationResponse(
        total_customers=len(df),
        premium_customers=int(premium_count),
        regular_customers=int(regular_count),
        new_customers=int(new_count),
        inactive_customers=int(inactive_count),
        silhouette_score=round(float(score), 3),
        customers=customers
    )
        