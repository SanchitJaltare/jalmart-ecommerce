
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const BASEURL =
    import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BASEURL}${product.image.startsWith("/") ? "" : "/"}${product.image}`
    : "";

  return (
    <Link
      to={`/product/${product.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          No image available
        </div>
      )}

      <div className="p-3">
        <h2 className="text-sm font-semibold text-gray-800">
          {product.name}
        </h2>

        <p className="text-xs font-medium text-gray-600 mt-1">
          ${Number(product.price).toFixed(2)}
        </p>

        <p className="text-xs text-blue-600 mt-2">
          View Product →
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
