
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const BASEURL =
    import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItems, setUpdatingItems] = useState([]);

  const cartKey = localStorage.getItem("cart_key");

  useEffect(() => {
    if (!cartKey) {
      setCart({ items: [] });
      setLoading(false);
      return;
    }

    fetch(
      `${BASEURL}/api/cart/?cart_key=${encodeURIComponent(cartKey)}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load cart.");
        return response.json();
      })
      .then(setCart)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [BASEURL, cartKey]);

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1 || updatingItems.includes(item.id)) return;

    setError("");
    setUpdatingItems((previous) => [...previous, item.id]);

    try {
      const response = await fetch(`${BASEURL}/api/cart/update/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_key: cartKey,
          product_id: item.product.id,
          quantity: newQuantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update quantity.");
      }

      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingItems((previous) =>
        previous.filter((id) => id !== item.id)
      );
    }
  };

  const handleRemove = async (productId) => {
    setError("");

    try {
      const response = await fetch(`${BASEURL}/api/cart/remove/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_key: cartKey,
          product_id: productId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove item.");
      }

      setCart(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="p-6">Loading cart...</p>;

  if (error && !cart) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  const items = cart?.items || [];

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.product.price) * item.quantity,
    0
  );

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Link to="/" className="text-blue-600 hover:underline">
        ← Continue Shopping
      </Link>

      <div className="max-w-4xl mx-auto mt-6 bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {error && (
          <p role="alert" className="mb-4 text-red-600">
            {error}
          </p>
        )}

        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-5">
              {items.map((item) => {
                const price = Number(item.product.price);
                const isUpdating = updatingItems.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 items-start sm:items-center border-b pb-5"
                  >
                    {item.product.image && (
                      <img
                        src={
                          item.product.image.startsWith("http")
                            ? item.product.image
                            : `${BASEURL}${
                                item.product.image.startsWith("/")
                                  ? ""
                                  : "/"
                              }${item.product.image}`
                        }
                        alt={item.product.name}
                        className="w-24 h-24 object-contain"
                      />
                    )}

                    <div className="flex-1">
                      <h2 className="font-semibold text-lg">
                        {item.product.name}
                      </h2>

                      <p>Price: ${price.toFixed(2)} each</p>

                      <div className="flex items-center gap-3 mt-3">
                        <span className="font-medium">Quantity:</span>

                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              item,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1 || isUpdating}
                          aria-label={`Decrease ${item.product.name} quantity`}
                          className="w-9 h-9 border rounded-md text-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          −
                        </button>

                        <span
                          className="min-w-6 text-center font-semibold"
                          aria-live="polite"
                        >
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              item,
                              item.quantity + 1
                            )
                          }
                          disabled={isUpdating}
                          aria-label={`Increase ${item.product.name} quantity`}
                          className="w-9 h-9 border rounded-md text-lg hover:bg-gray-100 disabled:opacity-40"
                        >
                          +
                        </button>

                        {isUpdating && (
                          <span className="text-sm text-gray-500">
                            Updating...
                          </span>
                        )}
                      </div>

                      <p className="font-semibold mt-3">
                        Subtotal: $
                        {(price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.product.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-right">
              <p className="text-sm text-gray-500">
                {totalItems} total item(s)
              </p>

              <p className="text-2xl font-bold text-green-600 mt-2">
                Total: ${total.toFixed(2)}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
