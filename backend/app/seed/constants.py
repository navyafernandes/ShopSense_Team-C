# app/seed/constants.py

# ==========================================================
# CATEGORIES
# ==========================================================

CATEGORIES = [
    "Electronics",
    "Fashion",
    "Sports",
    "Books",
    "Home & Kitchen",
    "Beauty & Personal Care",
    "Toys & Games",
    "Groceries",
    "Office Supplies",
    "Automotive",
]

# ==========================================================
# VENDOR BUSINESS NAMES
# ==========================================================

VENDOR_NAMES = [
    "TechNova Electronics",
    "Urban Style",
    "Elite Sports",
    "Book Haven",
    "Home Essentials",
    "FreshMart Grocery",
    "Beauty Bliss",
    "Toy Universe",
    "Office Depot Plus",
    "AutoCare Hub",
    "Smart Living",
    "Digital World",
    "FitZone",
    "Kitchen King",
    "NextGen Gadgets",
]

# ==========================================================
# PAYMENT
# ==========================================================

PAYMENT_METHODS = [
    "UPI",
    "CARD",
    "NET_BANKING",
    "COD",
    "WALLET",
]

PAYMENT_STATUS = [
    "SUCCESS",
    "SUCCESS",
    "SUCCESS",
    "SUCCESS",
    "PENDING",
    "FAILED",
]

# Weighted towards delivered orders
ORDER_STATUS = [
    "DELIVERED",
    "SHIPPED",
    "CONFIRMED",
    "PENDING",
    "CANCELLED",
]

# ==========================================================
# INVENTORY
# ==========================================================

WAREHOUSE_LOCATIONS = [
    "Mumbai Warehouse",
    "Bangalore Warehouse",
    "Delhi Warehouse",
    "Hyderabad Warehouse",
    "Chennai Warehouse",
]

# ==========================================================
# PRODUCT CATALOG
# ==========================================================

PRODUCT_CATALOG = {

    "Electronics": [

        {"name": "Samsung Galaxy S25", "brand": "Samsung"},
        {"name": "Samsung Galaxy A56", "brand": "Samsung"},
        {"name": "iPhone 16 Pro", "brand": "Apple"},
        {"name": "iPhone 15", "brand": "Apple"},
        {"name": "OnePlus 13", "brand": "OnePlus"},
        {"name": "Google Pixel 10", "brand": "Google"},
        {"name": "Sony WH-1000XM5", "brand": "Sony"},
        {"name": "Boat Rockerz 550", "brand": "Boat"},
        {"name": "Dell XPS 13", "brand": "Dell"},
        {"name": "HP Victus", "brand": "HP"},
        {"name": "Canon EOS R50", "brand": "Canon"},
        {"name": "Apple Watch Series 10", "brand": "Apple"},
        {"name": "Samsung Galaxy Watch 8", "brand": "Samsung"},
        {"name": "Logitech MX Master 3S", "brand": "Logitech"},
        {"name": "JBL Flip 7", "brand": "JBL"},
    ],

    "Fashion": [

        {"name": "Men's Hoodie", "brand": "Nike"},
        {"name": "Women's Kurti", "brand": "Biba"},
        {"name": "Slim Fit Jeans", "brand": "Levi's"},
        {"name": "Running Shoes", "brand": "Adidas"},
        {"name": "Leather Jacket", "brand": "Puma"},
        {"name": "Casual T-Shirt", "brand": "H&M"},
        {"name": "Sneakers", "brand": "Nike"},
        {"name": "Cotton Shirt", "brand": "Allen Solly"},
        {"name": "Women's Handbag", "brand": "Lavie"},
        {"name": "Sports Shorts", "brand": "Puma"},
    ],

    "Sports": [

        {"name": "Cricket Bat", "brand": "MRF"},
        {"name": "Football", "brand": "Nivia"},
        {"name": "Basketball", "brand": "Spalding"},
        {"name": "Badminton Racket", "brand": "Yonex"},
        {"name": "Yoga Mat", "brand": "Boldfit"},
        {"name": "Gym Gloves", "brand": "Strauss"},
        {"name": "Skipping Rope", "brand": "Adrenex"},
        {"name": "Tennis Ball Pack", "brand": "Cosco"},
        {"name": "Cycling Helmet", "brand": "Hero"},
        {"name": "Dumbbell Set", "brand": "Kore"},
    ],

    "Books": [

        {"name": "Atomic Habits", "brand": "Penguin"},
        {"name": "Clean Code", "brand": "Prentice Hall"},
        {"name": "The Alchemist", "brand": "Harper"},
        {"name": "Rich Dad Poor Dad", "brand": "Plata"},
        {"name": "Deep Work", "brand": "Grand Central"},
        {"name": "The Psychology of Money", "brand": "Harriman"},
        {"name": "Think and Grow Rich", "brand": "Fingerprint"},
        {"name": "Ikigai", "brand": "Penguin"},
    ],

        "Home & Kitchen": [

        {"name": "Non-Stick Frying Pan", "brand": "Prestige"},
        {"name": "Pressure Cooker", "brand": "Hawkins"},
        {"name": "Mixer Grinder", "brand": "Philips"},
        {"name": "Electric Kettle", "brand": "Prestige"},
        {"name": "Dinner Set", "brand": "Cello"},
        {"name": "Vacuum Cleaner", "brand": "Eureka Forbes"},
        {"name": "Microwave Oven", "brand": "LG"},
        {"name": "Air Fryer", "brand": "Philips"},
        {"name": "Water Purifier", "brand": "Kent"},
        {"name": "Rice Cooker", "brand": "Panasonic"},
    ],

    "Beauty & Personal Care": [

        {"name": "Face Wash", "brand": "Himalaya"},
        {"name": "Body Lotion", "brand": "Nivea"},
        {"name": "Shampoo", "brand": "L'Oréal"},
        {"name": "Hair Conditioner", "brand": "Dove"},
        {"name": "Perfume", "brand": "Bella Vita"},
        {"name": "Lipstick", "brand": "Maybelline"},
        {"name": "Sunscreen SPF 50", "brand": "Minimalist"},
        {"name": "Face Serum", "brand": "The Derma Co"},
        {"name": "Beard Trimmer", "brand": "Philips"},
        {"name": "Electric Toothbrush", "brand": "Oral-B"},
    ],

    "Toys & Games": [

        {"name": "LEGO Classic Set", "brand": "LEGO"},
        {"name": "Remote Control Car", "brand": "Hot Wheels"},
        {"name": "Rubik's Cube", "brand": "Hasbro"},
        {"name": "Chess Board", "brand": "Funskool"},
        {"name": "Building Blocks", "brand": "FunBlast"},
        {"name": "Barbie Doll", "brand": "Mattel"},
        {"name": "UNO Cards", "brand": "Mattel"},
        {"name": "Jigsaw Puzzle", "brand": "Skillmatics"},
        {"name": "Soft Teddy Bear", "brand": "Hamleys"},
        {"name": "Toy Kitchen Set", "brand": "Play-Doh"},
    ],

    "Groceries": [

        {"name": "Basmati Rice 5kg", "brand": "India Gate"},
        {"name": "Sunflower Oil 1L", "brand": "Fortune"},
        {"name": "Wheat Flour 10kg", "brand": "Aashirvaad"},
        {"name": "Sugar 1kg", "brand": "Madhur"},
        {"name": "Tea Powder", "brand": "Tata Tea"},
        {"name": "Coffee", "brand": "Nescafé"},
        {"name": "Biscuits", "brand": "Britannia"},
        {"name": "Instant Noodles", "brand": "Maggi"},
        {"name": "Peanut Butter", "brand": "Pintola"},
        {"name": "Corn Flakes", "brand": "Kellogg's"},
    ],

    "Office Supplies": [

        {"name": "A4 Paper Pack", "brand": "JK Copier"},
        {"name": "Gel Pen Pack", "brand": "Cello"},
        {"name": "Spiral Notebook", "brand": "Classmate"},
        {"name": "Desk Organizer", "brand": "Amazon Basics"},
        {"name": "Stapler", "brand": "Kangaro"},
        {"name": "Highlighter Set", "brand": "Faber-Castell"},
        {"name": "Whiteboard Markers", "brand": "Camlin"},
        {"name": "Laptop Stand", "brand": "Portronics"},
        {"name": "Office Chair", "brand": "Green Soul"},
        {"name": "Wireless Mouse", "brand": "Logitech"},
    ],

    "Automotive": [

        {"name": "Car Vacuum Cleaner", "brand": "Black+Decker"},
        {"name": "Car Phone Holder", "brand": "Spigen"},
        {"name": "Helmet", "brand": "Studds"},
        {"name": "Engine Oil 1L", "brand": "Castrol"},
        {"name": "Tyre Inflator", "brand": "Michelin"},
        {"name": "Car Air Freshener", "brand": "Godrej"},
        {"name": "Bike Cover", "brand": "AutoHub"},
        {"name": "Car Wash Shampoo", "brand": "3M"},
        {"name": "Jump Starter Kit", "brand": "Bosch"},
        {"name": "Dash Camera", "brand": "70mai"},
    ]

}