# app/seed/faker_utils.py

import random
import string
from faker import Faker

fake = Faker("en_IN")


# -----------------------------
# USER HELPERS
# -----------------------------

def full_name():
    return fake.name()


def email(name):
    username = (
        name.lower()
            .replace(" ", ".")
            .replace("'", "")
    )

    number = random.randint(100, 9999)

    return f"{username}{number}@shopsense.com"


def phone():
    return fake.msisdn()[:10]


# -----------------------------
# ADDRESS HELPERS
# -----------------------------

def address():
    return fake.street_address()


def city():
    return fake.city()


def state():
    return fake.state()


def postal_code():
    return fake.postcode()


def country():
    return "India"


# -----------------------------
# BUSINESS HELPERS
# -----------------------------

def gst_number():
    alphabet = string.ascii_uppercase

    return (
        f"{random.randint(10,38)}"
        f"{''.join(random.choices(alphabet,k=5))}"
        f"{random.randint(1000,9999)}"
        f"{random.choice(alphabet)}"
        f"{random.randint(1,9)}"
        f"Z"
        f"{random.randint(1,9)}"
    )


# -----------------------------
# PRODUCT HELPERS
# -----------------------------

def sku():
    return "SKU-" + ''.join(
        random.choices(
            string.ascii_uppercase + string.digits,
            k=8
        )
    )


def rating():
    return round(random.uniform(3.8, 5.0), 1)


def price(min_price, max_price):
    return round(random.uniform(min_price, max_price), 2)


def discount(price_value):
    percentage = random.choice([0, 5, 10, 15, 20])

    if percentage == 0:
        return None

    return round(
        price_value * (100 - percentage) / 100,
        2
    )


# -----------------------------
# INVENTORY
# -----------------------------

def stock():
    return random.randint(5, 250)


def reorder_level():
    return random.choice([10, 15, 20])


# -----------------------------
# ORDERS
# -----------------------------

def quantity():
    return random.randint(1, 4)


def tracking_number():
    return "TRK" + ''.join(
        random.choices(
            string.digits,
            k=10
        )
    )