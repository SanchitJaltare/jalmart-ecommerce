
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASEURL =
  import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";

function CustomerSignIn() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split(";") : [];

    for (const cookie of cookies) {
      const trimmed = cookie.trim();

      if (trimmed.startsWith(`${name}=`)) {
        return decodeURIComponent(
          trimmed.substring(name.length + 1)
        );
      }
    }

    return "";
  }

  async function prepareCsrf() {
    const response = await fetch(`${BASEURL}/api/auth/csrf/`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Unable to initialize secure login. Try again.");
    }

    const token = getCookie("csrftoken");

    if (!token) {
      throw new Error(
        "CSRF cookie was not received. Check Django's cookie and CORS settings."
      );
    }

    return token;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "register" && password !== passwordConfirm) {
        throw new Error("Passwords do not match.");
      }

      const csrfToken = await prepareCsrf();

      const endpoint =
        mode === "login"
          ? "/api/auth/login/"
          : "/api/auth/register/";

      const payload =
        mode === "login"
          ? { email: email.trim(), password }
          : {
              name: name.trim(),
              email: email.trim(),
              password,
              password_confirm: passwordConfirm,
            };

      const response = await fetch(`${BASEURL}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail =
          data.error ||
          data.detail ||
          data.email?.[0] ||
          data.name?.[0] ||
          data.password?.[0] ||
          data.password_confirm?.[0] ||
          Object.values(data).flat().find(
            (value) => typeof value === "string"
          );

        throw new Error(
          detail ||
            (mode === "login"
              ? "Unable to sign in."
              : "Unable to create your account.")
        );
      }

      setSuccess(
        mode === "login"
          ? "Welcome back! You are signed in."
          : "Your account has been created successfully."
      );

      // Allow the browser to retain the Django session cookie.
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
    setSuccess("");
    setPassword("");
    setPasswordConfirm("");
    setShowPassword(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/" className="text-2xl font-bold text-blue-700">
            JalMart
          </Link>

          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex items-center justify-center px-4 py-12 sm:py-16">
        <section className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:p-9">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              👤
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Customer Sign In
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {mode === "login"
                ? "Log in to your JalMart account."
                : "Create your JalMart customer account."}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => changeMode("login")}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Log In
            </button>

            <button
              type="button"
              onClick={() => changeMode("register")}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                mode === "register"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <div>
                <label
                  htmlFor="customer-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>

                <input
                  id="customer-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  maxLength={150}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="customer-email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input
                id="customer-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="customer-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="customer-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-700 hover:text-blue-900"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label
                  htmlFor="customer-password-confirm"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>

                <input
                  id="customer-password-confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(event) =>
                    setPasswordConfirm(event.target.value)
                  }
                  placeholder="Enter your password again"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}

            {mode === "register" && (
              <p className="text-xs leading-5 text-gray-500">
                Choose a strong password that meets the site's password
                requirements.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {mode === "login"
              ? "New to JalMart? "
              : "Already have an account? "}

            <button
              type="button"
              onClick={() =>
                changeMode(mode === "login" ? "register" : "login")
              }
              className="font-semibold text-blue-700 hover:underline"
            >
              {mode === "login" ? "Create an account" : "Log in"}
            </button>
          </p>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500">
        Made by Sanchit Jaltare
      </footer>
    </div>
  );
}

export default CustomerSignIn;
