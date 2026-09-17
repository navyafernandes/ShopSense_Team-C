import sys
import uuid
from pathlib import Path

backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app.main import app

_client = TestClient(app)

class _UniversalClient:
    def get(self, url, **kwargs):
        path = url.replace("http://127.0.0.1:8000", "").replace("http://localhost:8000", "")
        return _client.get(path or "/", **kwargs)

    def post(self, url, **kwargs):
        path = url.replace("http://127.0.0.1:8000", "").replace("http://localhost:8000", "")
        return _client.post(path or "/", **kwargs)

requests = _UniversalClient()
BASE_URL = "http://127.0.0.1:8000"


def test_customer_registration_success():
    unique_email = f"cust_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "full_name": "Test Customer",
        "email": unique_email,
        "password": "StrongPass123!",
        "phone": "1234567890",
        "role": "CUSTOMER",
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == unique_email
    assert data["full_name"] == "Test Customer"
    assert data["role"] == "CUSTOMER"
    assert data["status"] == "ACTIVE"


def test_vendor_registration_success():
    unique_suffix = uuid.uuid4().hex[:8]
    unique_email = f"vend_{unique_suffix}@example.com"
    payload = {
        "full_name": "Test Vendor",
        "email": unique_email,
        "password": "StrongPass123!",
        "phone": "9876543210",
        "role": "VENDOR",
        "business_name": "Awesome Store",
        "business_type": "Retail",
        "gst_number": f"GST{unique_suffix.upper()}",
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == unique_email
    assert data["role"] == "VENDOR"


def test_registration_password_too_short():
    payload = {
        "full_name": "Short Pass User",
        "email": f"short_{uuid.uuid4().hex[:8]}@example.com",
        "password": "Ab1!",
        "role": "CUSTOMER",
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=payload)
    assert response.status_code == 422
    assert "at least 8 characters" in response.text


def test_registration_password_missing_uppercase():
    payload = {
        "full_name": "No Upper User",
        "email": f"noupper_{uuid.uuid4().hex[:8]}@example.com",
        "password": "password123!",
        "role": "CUSTOMER",
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=payload)
    assert response.status_code == 422
    assert "uppercase" in response.text


def test_registration_password_missing_lowercase():
    payload = {
        "full_name": "No Lower User",
        "email": f"nolower_{uuid.uuid4().hex[:8]}@example.com",
        "password": "PASSWORD123!",
        "role": "CUSTOMER",
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=payload)
    assert response.status_code == 422
    assert "lowercase" in response.text


def test_registration_password_missing_number():
    payload = {
        "full_name": "No Number User",
        "email": f"nonumber_{uuid.uuid4().hex[:8]}@example.com",
        "password": "Password!@#",
        "role": "CUSTOMER",
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=payload)
    assert response.status_code == 422
    assert "number" in response.text


def test_registration_password_missing_special_char():
    payload = {
        "full_name": "No Special User",
        "email": f"nospecial_{uuid.uuid4().hex[:8]}@example.com",
        "password": "Password123",
        "role": "CUSTOMER",
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=payload)
    assert response.status_code == 422
    assert "special character" in response.text


def test_registration_duplicate_email():
    unique_email = f"dup_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "full_name": "Duplicate User",
        "email": unique_email,
        "password": "StrongPass123!",
        "role": "CUSTOMER",
    }
    response1 = requests.post(f"{BASE_URL}/auth/register", json=payload)
    assert response1.status_code == 200

    response2 = requests.post(f"{BASE_URL}/auth/register", json=payload)
    assert response2.status_code == 400
    assert "Email already exists" in response2.text


def test_registered_user_login():
    unique_email = f"login_{uuid.uuid4().hex[:8]}@example.com"
    password = "StrongPass123!"
    reg_payload = {
        "full_name": "Login User",
        "email": unique_email,
        "password": password,
        "role": "CUSTOMER",
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=reg_payload)
    assert response.status_code == 200

    login_payload = {
        "email": unique_email,
        "password": password,
    }
    login_response = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert "access_token" in login_data
    assert login_data["role"] == "CUSTOMER"
    assert login_data["name"] == "Login User"
