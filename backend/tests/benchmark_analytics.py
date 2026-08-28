import time
import statistics
import requests


BASE_URL = "http://127.0.0.1:8000"

ENDPOINTS = [
    "/analytics/admin/dashboard",
    "/analytics/sales",
    "/analytics/vendors",
    "/analytics/products",
    "/analytics/inventory",
    "/analytics/revenue-trend",
]

REQUESTS_PER_ENDPOINT = 10


def benchmark_endpoint(endpoint):

    times = []
    errors = 0

    print("\n" + "=" * 65)
    print(f"Testing: {endpoint}")
    print("=" * 65)

    for i in range(REQUESTS_PER_ENDPOINT):

        start = time.perf_counter()

        try:

            response = requests.get(
                BASE_URL + endpoint,
                timeout=30
            )

            elapsed = (
                time.perf_counter() - start
            ) * 1000

            if response.status_code == 200:

                times.append(elapsed)

                print(
                    f"Request {i + 1:02d} | "
                    f"{elapsed:.2f} ms | "
                    f"Status: {response.status_code}"
                )

            else:

                errors += 1

                print(
                    f"Request {i + 1:02d} | "
                    f"FAILED | "
                    f"Status: {response.status_code}"
                )

        except requests.RequestException as e:

            errors += 1

            print(
                f"Request {i + 1:02d} | "
                f"ERROR | {e}"
            )

    if not times:

        print("\nNo successful requests.")
        return

    print("\nResults")
    print("-" * 65)

    print(
        f"Average response time : "
        f"{statistics.mean(times):.2f} ms"
    )

    print(
        f"Median response time  : "
        f"{statistics.median(times):.2f} ms"
    )

    print(
        f"Minimum response time : "
        f"{min(times):.2f} ms"
    )

    print(
        f"Maximum response time : "
        f"{max(times):.2f} ms"
    )

    print(
        f"Successful requests   : "
        f"{len(times)}/{REQUESTS_PER_ENDPOINT}"
    )

    print(
        f"Failed requests       : "
        f"{errors}"
    )


def main():

    print("\n")
    print("=" * 65)
    print("ShopSense Analytics - Baseline Performance Test")
    print("=" * 65)

    print(
        f"\nRequests per endpoint: "
        f"{REQUESTS_PER_ENDPOINT}"
    )

    print(
        f"Server: {BASE_URL}"
    )

    for endpoint in ENDPOINTS:
        benchmark_endpoint(endpoint)

    print("\n")
    print("=" * 65)
    print("Baseline benchmark completed.")
    print("=" * 65)


if __name__ == "__main__":
    main()