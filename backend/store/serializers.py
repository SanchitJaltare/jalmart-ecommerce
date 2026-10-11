
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Product, Category, Cart, CartItem, ProductReview


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Product
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "cart_key", "created_at", "items"]


class CustomerRegistrationSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )
    password_confirm = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "This email cannot be used for a new account."
            )

        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({
                "password_confirm": "Passwords do not match."
            })

        return attrs

    def create(self, validated_data):
        email = validated_data["email"]
        name = validated_data["name"].strip()

        if not name:
            raise serializers.ValidationError({
                "name": "Name is required."
            })

        return User.objects.create_user(
            username=email,
            email=email,
            password=validated_data["password"],
            first_name=name,
        )


class CustomerSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name", "email"]

    def get_name(self, obj):
        return obj.first_name or obj.username


class ProductReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = ProductReview
        fields = [
            "id",
            "product",
            "customer",
            "customer_name",
            "rating",
            "review",
            "is_approved",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "product",
            "customer",
            "customer_name",
            "is_approved",
            "created_at",
            "updated_at",
        ]

    def get_customer_name(self, obj):
        return obj.customer.first_name or obj.customer.username
