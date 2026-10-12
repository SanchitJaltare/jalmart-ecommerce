
# FRONTEND CORS AND CSRF
CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:5173,"
        "http://127.0.0.1:5173,"
        "https://jalmart-ecommerce-f659w6wmd-sanchit-jaltares-projects.vercel.app",
    ).split(",")
    if origin.strip()
]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CSRF_TRUSTED_ORIGINS",
        "http://localhost:5173,"
        "http://127.0.0.1:5173,"
        "https://jalmart-ecommerce-f659w6wmd-sanchit-jaltares-projects.vercel.app",
    ).split(",")
    if origin.strip()
]
