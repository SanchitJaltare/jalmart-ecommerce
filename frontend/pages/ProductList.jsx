
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASEURL =
    import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(`${BASEURL}/api/products/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("The API did not return a product list.");
        }
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading products: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between px-6 py-5 bg-white shadow-md">
        <h1 className="text-3xl font-bold">Product List</h1>

        <Link
          to="/cart"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-md"
        >
          View Cart 🛒
        </Link>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center col-span-full">
            No products available.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductList;
