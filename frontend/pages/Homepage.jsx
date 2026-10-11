
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

const BASEURL =
  import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";

const LOGO_URL =
  "https://i.postimg.cc/HsYJfxVF/bfb140d3-4532-4715-bb80-5f3b0c076adc.png";

const BANNERS = [
  {
    image:
      "https://i.postimg.cc/PJ2qtWPc/382e69da-94a4-406e-a0d8-f3c6bde0c13a.png",
    alt: "JalMart home essentials and furniture",
  },
  {
    image:
      "https://i.postimg.cc/Fzs9nYDf/aac9e79f-4279-4c49-8bdd-69998728e16e.png",
    alt: "JalMart electronics and smart products",
  },
];

const CATEGORY_NAMES = ["Electronic", "Household", "Wooden"];

function Homepage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeBanner, setActiveBanner] = useState(0);

  // Fetch products from Django.
  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const response = await fetch(`${BASEURL}/api/products/`);

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("The API did not return a product list.");
        }

        if (!cancelled) {
          setProducts(data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching homepage products:", err);
          setError(err.message || "Unable to load products.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Automatically rotate the two banners.
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((current) => (current + 1) % BANNERS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.slice(0, 8);

  function getCategoryName(product) {
    const category = product.category;

    if (typeof category === "string") {
      return category.trim().toLowerCase();
    }

    return String(category?.name || "").trim().toLowerCase();
  }

  function getCategoryProducts(categoryName) {
    const normalizedName = categoryName.toLowerCase();

    return products.filter(
      (product) => getCategoryName(product) === normalizedName
    );
  }

  function changeBanner(direction) {
    setActiveBanner(
      (current) => (current + direction + BANNERS.length) % BANNERS.length
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" aria-label="JalMart home" className="shrink-0">
            <img
              src={LOGO_URL}
              alt="JalMart - Everyday Essentials"
              className="h-auto w-36 object-contain sm:w-48"
            />
          </Link>

          <nav className="flex items-center gap-3 sm:gap-5 lg:gap-6">
            <a
              href="#categories"
              className="hidden text-sm font-medium text-gray-700 transition hover:text-blue-600 sm:inline"
            >
              Categories
            </a>

            <a
              href="#featured"
              className="hidden text-sm font-medium text-gray-700 transition hover:text-blue-600 sm:inline"
            >
              Best Products
            </a>

            <Link
              to="/products"
              className="hidden text-sm font-medium text-gray-700 transition hover:text-blue-600 sm:inline"
            >
              Shop All
            </Link>

            <Link
              to="/contact"
              className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
            >
              Contact Us
            </Link>

            <Link
              to="/privacy-policy"
              className="hidden text-sm font-medium text-gray-700 transition hover:text-blue-600 lg:inline"
            >
              Privacy Policy
            </Link>

            {/* Customer Sign In */}
            <Link
              to="/login"
              className="rounded-lg border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 sm:px-4 sm:py-2.5"
            >
              <span className="hidden sm:inline">Customer Sign In</span>
              <span className="sm:hidden">Sign In</span>
            </Link>

            <Link
              to="/cart"
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:px-5 sm:py-2.5"
            >
              🛒 <span className="hidden sm:inline">View Cart</span>
              <span className="sm:hidden">Cart</span>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Two-banner slider */}
        <section
          aria-label="JalMart promotions"
          className="mx-auto max-w-7xl px-3 pt-5 sm:px-6 sm:pt-8 lg:px-8"
        >
          <div className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
            <Link
              to="/products"
              aria-label="Explore JalMart products"
              className="block"
            >
              {BANNERS.map((banner, index) => (
                <img
                  key={banner.image}
                  src={banner.image}
                  alt={banner.alt}
                  className={`${
                    index === activeBanner ? "block" : "hidden"
                  } h-auto max-h-[520px] w-full object-contain`}
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              ))}
            </Link>

            <button
              type="button"
              onClick={() => changeBanner(-1)}
              aria-label="Previous banner"
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-gray-800 shadow-md transition hover:bg-white sm:left-4 sm:h-11 sm:w-11"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() => changeBanner(1)}
              aria-label="Next banner"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-gray-800 shadow-md transition hover:bg-white sm:right-4 sm:h-11 sm:w-11"
            >
              ›
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {BANNERS.map((banner, index) => (
                <button
                  key={banner.image}
                  type="button"
                  onClick={() => setActiveBanner(index)}
                  aria-label={`Show banner ${index + 1}`}
                  aria-current={index === activeBanner}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeBanner
                      ? "w-7 bg-blue-600"
                      : "w-2.5 bg-white/90"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured products */}
        <section
          id="featured"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        >
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
                Shop our collection
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Best Products We Have
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Discover products available at JalMart.
              </p>
            </div>

            <Link
              to="/products"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              View all products →
            </Link>
          </div>

          {loading ? (
            <p className="rounded-xl bg-gray-50 p-8 text-center text-gray-500">
              Loading products...
            </p>
          ) : error ? (
            <p className="rounded-xl bg-red-50 p-6 text-center text-red-600">
              Unable to load products: {error}
            </p>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-gray-50 p-8 text-center text-gray-500">
              No products available yet.
            </p>
          )}
        </section>

        {/* Dynamic category catalogs */}
        <section
          id="categories"
          className="scroll-mt-20 bg-gray-50 py-12 sm:py-16"
        >
          <div className="mx-auto max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8">
            {CATEGORY_NAMES.map((categoryName) => {
              const categoryProducts = getCategoryProducts(categoryName);

              return (
                <section
                  key={categoryName}
                  id={`category-${categoryName.toLowerCase()}`}
                >
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
                        Explore our collection
                      </p>

                      <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        {categoryName}
                      </h2>
                    </div>

                    <Link
                      to={`/products?category=${encodeURIComponent(
                        categoryName
                      )}`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Explore category →
                    </Link>
                  </div>

                  {loading ? (
                    <p className="rounded-xl bg-white p-6 text-gray-500">
                      Loading {categoryName.toLowerCase()} products...
                    </p>
                  ) : error ? (
                    <p className="rounded-xl bg-white p-6 text-red-600">
                      Products could not be loaded.
                    </p>
                  ) : categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                      {categoryProducts.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
                      No products in this category yet. Add products under{" "}
                      {categoryName} in Django Admin to display them here.
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
              The JalMart experience
            </p>

            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Why Choose Us
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              A simple way to explore electronics, household essentials, and
              wooden products in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                🛍️
              </div>

              <h3 className="font-bold text-gray-900">
                Variety of Products
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Explore different product categories in one convenient place.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                🔎
              </div>

              <h3 className="font-bold text-gray-900">
                Easy Product Discovery
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Browse organized categories and view product details before
                making a choice.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                🛒
              </div>

              <h3 className="font-bold text-gray-900">
                Convenient Shopping
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                View product information and manage your selections through
                the shopping cart.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-7 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-gray-600">
            <span className="mr-1" aria-hidden="true">
              📍
            </span>
            Shallom Apartment, Vasant Kunj
          </p>

          <p className="text-sm text-gray-500">
            Made by Sanchit Jaltare
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;

