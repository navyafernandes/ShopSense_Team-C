from app.services.ai_service import generate_ai_analysis

sample = {
    "benchmark": {
        "vendor_rank": 2,
        "total_vendors": 15,
        "percentile": 86.67
    },
    "health": {
        "score": 100,
        "status": "Excellent"
    },
    "top_products": [
        {
            "product_name": "iPhone 15",
            "units_sold": 161
        }
    ],
    "revenue_by_category": [
        {
            "category": "Books",
            "revenue": 11213711.75
        }
    ]
}

print(generate_ai_analysis(sample))