from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.order_item import OrderItem
from app.models.vendor import Vendor


def get_vendor_benchmark(
    db: Session,
    vendor_id: int,
):
    # Revenue of every vendor
    vendor_revenues = (
        db.query(
            OrderItem.vendor_id,
            func.coalesce(
                func.sum(
                    OrderItem.quantity * OrderItem.price
                ),
                0,
            ).label("revenue"),
        )
        .group_by(OrderItem.vendor_id)
        .all()
    )

    if not vendor_revenues:
        return None

    # Convert to list
    revenue_list = []

    for row in vendor_revenues:
        revenue_list.append(
            {
                "vendor_id": row.vendor_id,
                "revenue": float(row.revenue),
            }
        )

    # Sort by revenue (highest first)
    revenue_list.sort(
        key=lambda x: x["revenue"],
        reverse=True,
    )

    total_vendors = len(revenue_list)

    market_average = (
        sum(v["revenue"] for v in revenue_list)
        / total_vendors
    )

    vendor_rank = None
    vendor_revenue = 0

    for index, vendor in enumerate(revenue_list):

        if vendor["vendor_id"] == vendor_id:

            vendor_rank = index + 1
            vendor_revenue = vendor["revenue"]
            break

    if vendor_rank is None:
        return None

    percentile = round(
        (
            (total_vendors - vendor_rank)
            / total_vendors
        )
        * 100,
        2,
    )

    if percentile >= 90:
        status = "Top Performer"
    elif percentile >= 70:
        status = "Above Average"
    elif percentile >= 40:
        status = "Average"
    else:
        status = "Needs Improvement"

    return {
        "vendor_rank": vendor_rank,
        "total_vendors": total_vendors,
        "vendor_revenue": round(vendor_revenue, 2),
        "market_average_revenue": round(
            market_average,
            2,
        ),
        "percentile": percentile,
        "status": status,
    }