
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Product, Category, Cart, CartItem, ProductReview
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    CartSerializer,
    CustomerRegistrationSerializer,
    CustomerSerializer,
    ProductReviewSerializer,
)


@api_view(["GET"])
def product_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def cart_detail(request):
    cart_key = request.query_params.get("cart_key")

    if not cart_key:
        return Response(
            {"error": "cart_key is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cart, _ = Cart.objects.get_or_create(cart_key=cart_key)
    return Response(CartSerializer(cart).data)


@api_view(["POST"])
def cart_add(request):
    cart_key = request.data.get("cart_key")
    product_id = request.data.get("product_id")
    quantity = request.data.get("quantity", 1)

    if not cart_key or not product_id:
        return Response(
            {"error": "cart_key and product_id are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        quantity = int(quantity)
        if quantity < 1:
            raise ValueError
    except (TypeError, ValueError):
        return Response(
            {"error": "quantity must be a positive integer."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    product = get_object_or_404(Product, pk=product_id)
    cart, _ = Cart.objects.get_or_create(cart_key=cart_key)

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={"quantity": quantity},
    )

    if not created:
        item.quantity += quantity
        item.save(update_fields=["quantity"])

    return Response(
        CartSerializer(cart).data,
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def cart_update(request):
    cart_key = request.data.get("cart_key")
    product_id = request.data.get("product_id")
    quantity = request.data.get("quantity")

    if not cart_key or not product_id or quantity is None:
        return Response(
            {
                "error": (
                    "cart_key, product_id, and quantity are required."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        quantity = int(quantity)
        if quantity < 1:
            raise ValueError
    except (TypeError, ValueError):
        return Response(
            {"error": "Quantity must be a positive integer."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cart = get_object_or_404(Cart, cart_key=cart_key)
    item = get_object_or_404(
        CartItem,
        cart=cart,
        product_id=product_id,
    )

    item.quantity = quantity
    item.save(update_fields=["quantity"])

    return Response(CartSerializer(cart).data)


@api_view(["POST"])
def cart_remove(request):
    cart_key = request.data.get("cart_key")
    product_id = request.data.get("product_id")

    if not cart_key or not product_id:
        return Response(
            {"error": "cart_key and product_id are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cart = get_object_or_404(Cart, cart_key=cart_key)

    CartItem.objects.filter(
        cart=cart,
        product_id=product_id,
    ).delete()

    return Response(CartSerializer(cart).data)


# Product reviews: public GET, authenticated POST.
@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def product_reviews(request, product_id):
    product = get_object_or_404(Product, pk=product_id)

    if request.method == "GET":
        reviews = ProductReview.objects.filter(
            product=product,
            is_approved=True,
        ).select_related("customer")

        serializer = ProductReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    # Only logged-in customers may submit reviews.
    if not request.user.is_authenticated:
        return Response(
            {"error": "Please sign in to submit a review."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # One review per customer per product.
    if ProductReview.objects.filter(
        product=product,
        customer=request.user,
    ).exists():
        return Response(
            {
                "error": (
                    "You have already reviewed this product."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = ProductReviewSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # Approval is deliberately not accepted from the customer.
    review = serializer.save(
        product=product,
        customer=request.user,
        is_approved=False,
    )

    return Response(
        {
            "message": (
                "Review submitted successfully and is awaiting approval."
            ),
            "review": ProductReviewSerializer(review).data,
        },
        status=status.HTTP_201_CREATED,
    )


# Ensure the browser receives a CSRF cookie before authentication requests.
@ensure_csrf_cookie
@api_view(["GET"])
@permission_classes([AllowAny])
def csrf_token(request):
    return Response({"message": "CSRF cookie set."})


@csrf_protect
@api_view(["POST"])
@permission_classes([AllowAny])
def customer_register(request):
    serializer = CustomerRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    login(
        request,
        user,
        backend="django.contrib.auth.backends.ModelBackend",
    )

    return Response(
        {
            "message": "Account created successfully.",
            "customer": CustomerSerializer(user).data,
        },
        status=status.HTTP_201_CREATED,
    )


@csrf_protect
@api_view(["POST"])
@permission_classes([AllowAny])
def customer_login(request):
    email = request.data.get("email", "").strip().lower()
    password = request.data.get("password", "")

    if not email or not password:
        return Response(
            {"error": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(
        request,
        username=email,
        password=password,
    )

    if user is None:
        return Response(
            {"error": "Invalid email or password."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    login(request, user)

    return Response({
        "message": "Login successful.",
        "customer": CustomerSerializer(user).data,
    })


@csrf_protect
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def customer_logout(request):
    logout(request)
    return Response({"message": "Logged out successfully."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def customer_me(request):
    return Response(CustomerSerializer(request.user).data)
