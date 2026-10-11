
from django.urls import path
from . import views

urlpatterns = [
    # Products and categories
    path("products/", views.product_list, name="product-list"),
    path("categories/", views.category_list, name="category-list"),

    # Product reviews
    path(
        "products/<int:product_id>/reviews/",
        views.product_reviews,
        name="product-reviews",
    ),

    # Cart endpoints
    path("cart/", views.cart_detail, name="cart-detail"),
    path("cart/add/", views.cart_add, name="cart-add"),
    path("cart/update/", views.cart_update, name="cart-update"),
    path("cart/remove/", views.cart_remove, name="cart-remove"),

    # Customer authentication
    path("auth/csrf/", views.csrf_token, name="auth-csrf"),
    path("auth/register/", views.customer_register, name="customer-register"),
    path("auth/login/", views.customer_login, name="customer-login"),
    path("auth/logout/", views.customer_logout, name="customer-logout"),
    path("auth/me/", views.customer_me, name="customer-me"),
]
