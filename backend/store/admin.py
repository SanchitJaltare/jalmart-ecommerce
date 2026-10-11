
from django.contrib import admin
from .models import (
    Category,
    Product,
    UserProfile,
    Order,
    OrderItem,
    ProductReview,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug")
    search_fields = ("name", "slug")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price", "category", "created_at")
    search_fields = ("name", "description")
    list_filter = ("category",)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "phone", "address")
    search_fields = ("user__username", "user__email", "phone")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "total_price", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("user__username", "user__email")


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "product", "quantity", "price")
    search_fields = ("product__name",)


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "product",
        "customer",
        "rating",
        "is_approved",
        "created_at",
    )
    list_filter = ("is_approved", "rating", "created_at")
    search_fields = (
        "product__name",
        "customer__username",
        "customer__email",
        "review",
    )
    list_editable = ("is_approved",)
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)
