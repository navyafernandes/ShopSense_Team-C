from collections import Counter

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.payment import Payment
from app.models.product import Product
from app.models.category import Category
from app.models.inventory import Inventory

from app.schemas.recommendation_schema import (
    RecommendationResponse,
    RecommendedProduct,
)


def get_recommendations(
    db: Session,
    customer_id: int
):
    # Products already purchased by the customer
    purchased_products = (
        db.query(OrderItem.product_id)
        .join(Order, Order.order_id == OrderItem.order_id)
        .join(Payment, Payment.order_id == Order.order_id)
        .filter(
            Order.customer_id == customer_id,
            Payment.payment_status == "SUCCESS"
        )
        .all()
    )

    purchased_product_ids = [
        row.product_id
        for row in purchased_products
    ]

    # -------------------------------
    # Cold Start (No purchase history)
    # -------------------------------
    if not purchased_product_ids:

        popular_products = (
            db.query(
                Product,
                func.coalesce(
                    func.sum(OrderItem.quantity),
                    0
                ).label("units_sold")
            )
            .join(
                Inventory,
                Inventory.product_id == Product.product_id
            )
            .outerjoin(
                OrderItem,
                OrderItem.product_id == Product.product_id
            )
            .outerjoin(
                Order,
                Order.order_id == OrderItem.order_id
            )
            .outerjoin(
                Payment,
                Payment.order_id == Order.order_id
            )
            .filter(
                Inventory.stock_quantity > 0
            )
            .group_by(Product.product_id)
            .order_by(
                func.coalesce(
                    func.sum(OrderItem.quantity),
                    0
                ).desc()
            )
            .limit(4)
            .all()
        )

        recommendations = []

        for product, _ in popular_products:

            recommendations.append(
                RecommendedProduct(
                   product_id=product.product_id,
                   product_name=product.product_name,
                   brand=product.brand,
                   thumbnail_url=product.thumbnail_url,
                   category_name=product.category.category_name,
                   price=float(product.price),
                   discount_price=float(product.discount_price)
                   if product.discount_price
                   else None,
                   rating=float(product.rating)
                   if product.rating
                   else None,
                   reason="Popular among customers"
)
            )

        return RecommendationResponse(
            total_recommendations=len(recommendations),
            recommended_products=recommendations
        )

    # ----------------------------------------
    # Find customer's favourite category
    # ----------------------------------------
    categories = (
        db.query(Category.category_name)
        .join(
            Product,
            Product.category_id == Category.category_id
        )
        .filter(
            Product.product_id.in_(purchased_product_ids)
        )
        .all()
    )

    category_counter = Counter(
        row.category_name
        for row in categories
    )

    preferred_category = category_counter.most_common(1)[0][0]

    # ----------------------------------------
    # Recommend similar products
    # ----------------------------------------
    recommended_products = (
        db.query(
            Product,
            func.coalesce(
                func.sum(OrderItem.quantity),
                0
            ).label("units_sold")
        )
        .join(
            Category,
            Category.category_id == Product.category_id
        )
        .join(
            Inventory,
            Inventory.product_id == Product.product_id
        )
        .outerjoin(
            OrderItem,
            OrderItem.product_id == Product.product_id
        )
        .filter(
            Category.category_name == preferred_category,
            ~Product.product_id.in_(purchased_product_ids),
            Inventory.stock_quantity > 0
        )
        .group_by(Product.product_id)
        .order_by(
            func.coalesce(
                func.sum(OrderItem.quantity),
                0
            ).desc()
        )
        .limit(4)
        .all()
    )

    recommendations = []

    for product, _ in recommended_products:
        recommendations.append(
            RecommendedProduct(
                product_id=product.product_id,
                product_name=product.product_name,
                brand=product.brand,
                thumbnail_url=product.thumbnail_url,
                category_name=product.category.category_name,
                price=float(product.price),
                discount_price=float(product.discount_price)
                if product.discount_price
                else None,
                rating=float(product.rating)
                if product.rating
                else None,
                reason=f"Because you like {preferred_category}"
            )
        )

    # -------------------------------------------------
    # Fallback: Fill remaining recommendations with
    # popular products if less than 4 are found
    # -------------------------------------------------

    if len(recommendations) < 4:

        existing_ids = {
            r.product_id
            for r in recommendations
        }

        popular_products = (
            db.query(
                Product,
                func.coalesce(
                    func.sum(OrderItem.quantity),
                    0
                ).label("units_sold")
            )
            .join(
                Inventory,
                Inventory.product_id == Product.product_id
            )
            .outerjoin(
                OrderItem,
                OrderItem.product_id == Product.product_id
            )
            .filter(
                Inventory.stock_quantity > 0,
                ~Product.product_id.in_(purchased_product_ids)
            )
            .group_by(Product.product_id)
            .order_by(
                func.coalesce(
                    func.sum(OrderItem.quantity),
                    0
                ).desc()
            )
            .all()
        )

        for product, _ in popular_products:

            if product.product_id in existing_ids:
                continue

            recommendations.append(
                RecommendedProduct(
                    product_id=product.product_id,
                    product_name=product.product_name,
                    brand=product.brand,
                    thumbnail_url=product.thumbnail_url,
                    category_name=product.category.category_name,
                    price=float(product.price),
                    discount_price=float(product.discount_price)
                    if product.discount_price
                    else None,
                    rating=float(product.rating)
                    if product.rating
                    else None,
                    reason="Popular among customers"
                )
            )

            existing_ids.add(product.product_id)

            if len(recommendations) == 4:
                break

    return RecommendationResponse(
        total_recommendations=len(recommendations),
        recommended_products=recommendations
    )