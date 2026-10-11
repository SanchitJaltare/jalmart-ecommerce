
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const BASEURL =
    import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  const [cartKey] = useState(() => {
    let key = localStorage.getItem("cart_key");

    if (!key) {
      key = `cart-${crypto.randomUUID()}`;
      localStorage.setItem("cart_key", key);
    }

    return key;
  });

  useEffect(() => {
    fetch(`${BASEURL}/api/products/`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch product");
        return response.json();
      })
      .then((products) => {
        const selectedProduct = products.find(
          (item) => String(item.id) === id
        );

        if (!selectedProduct) throw new Error("Product not found");

        setProduct(selectedProduct);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [BASEURL, id]);

  useEffect(() => {
    let cancelled = false;

    setReviewsLoading(true);
    setReviewError("");
    setReviewMessage("");

    fetch(`${BASEURL}/api/products/${id}/reviews/`, {
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load reviews.");
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setReviews(data);
      })
      .catch((err) => {
        if (!cancelled) setReviewError(err.message);
      })
      .finally(() => {
        if (!cancelled) setReviewsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [BASEURL, id]);

  const handleAddToCart = async () => {
    if (!product || adding) return;

    setAdding(true);

    try {
      const response = await fetch(`${BASEURL}/api/cart/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_key: cartKey,
          product_id: product.id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not add product to cart.");
      }

      alert(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Cart error:", err);
      alert(err.message || "Could not connect to the cart.");
    } finally {
      setAdding(false);
    }
  };

  const getCsrfToken = () => {
    const cookie = document.cookie
      .split("; ")
      .find((item) => item.startsWith("csrftoken="));

    return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : "";
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewError("");
    setReviewMessage("");

    if (!reviewText.trim()) {
      setReviewError("Please write your review before submitting.");
      return;
    }

    setSubmittingReview(true);

    try {
      // Ensure the browser has a CSRF cookie.
      await fetch(`${BASEURL}/api/auth/csrf/`, {
        credentials: "include",
      });

      const csrfToken = getCsrfToken();

      if (!csrfToken) {
        throw new Error(
          "Could not obtain a security token. Please refresh and try again."
        );
      }

      const response = await fetch(
        `${BASEURL}/api/products/${id}/reviews/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({
            rating,
            review: reviewText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.detail ||
            "Could not submit your review. Please try again."
        );
      }

      setReviewText("");
      setRating(5);
      setReviewMessage(
        data.message ||
          "Your review was submitted and is awaiting approval."
      );
    } catch (err) {
      setReviewError(err.message || "Could not submit your review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <p className="p-6">Loading product...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BASEURL}${product.image.startsWith("/") ? "" : "/"}${product.image}`
    : "";

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((total, review) => total + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Link to="/" className="text-blue-600 hover:underline">
        ← Back to Products
      </Link>

      <div className="max-w-4xl mx-auto mt-6 bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-80 object-contain rounded-lg"
          />
        ) : (
          <div className="h-80 bg-gray-200 flex items-center justify-center">
            No image available
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {product.name}
          </h1>

          <p className="text-gray-600 mt-3">
            {product.description || "No description available."}
          </p>

          <p className="text-2xl font-bold text-green-600 mt-5">
            ${Number(product.price).toFixed(2)}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 px-6 rounded-md"
          >
            {adding ? "Adding..." : "Add to Cart 🛒"}
          </button>
        </div>
      </div>

      {/* Product reviews */}
      <section className="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Customer Reviews
        </h2>

        {reviewsLoading ? (
          <p className="text-gray-500 mt-4">Loading reviews...</p>
        ) : (
          <>
            {averageRating && (
              <p className="mt-2 text-gray-700">
                <span className="text-yellow-500">
                  {"★".repeat(Math.round(Number(averageRating)))}
                  {"☆".repeat(5 - Math.round(Number(averageRating)))}
                </span>{" "}
                <strong>{averageRating}/5</strong> from {reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"}
              </p>
            )}

            {reviews.length === 0 ? (
              <p className="mt-4 text-gray-500">
                No approved reviews yet. Be the first to share your experience!
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                {reviews.map((review) => (
                  <article
                    key={review.id}
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-gray-800">
                        {review.customer_name}
                      </p>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="mt-1 text-yellow-500">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </p>

                    <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                      {review.review}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {/* Submit a review */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Write a Review
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Reviews are published after admin approval.
          </p>

          <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Your rating
              </label>

              <div className="flex gap-2" role="group" aria-label="Choose rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    aria-pressed={rating === star}
                    className={`text-3xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    } hover:scale-110 transition`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="product-review"
                className="block font-medium text-gray-700 mb-2"
              >
                Your review
              </label>

              <textarea
                id="product-review"
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                maxLength={2000}
                rows={4}
                placeholder="Share your experience with this product..."
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <p className="mt-1 text-right text-sm text-gray-500">
                {reviewText.length}/2000
              </p>
            </div>

            {reviewError && (
              <p role="alert" className="text-red-600">
                {reviewError}
              </p>
            )}

            {reviewMessage && (
              <p role="status" className="text-green-700">
                {reviewMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 px-6 rounded-md"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>

            <p className="text-sm text-gray-500">
              You must be signed in to submit a review.{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in here
              </Link>
              .
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;
