
import { Link } from "react-router-dom";

function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-2xl font-bold text-blue-700">
            JalMart
          </Link>

          <Link
            to="/"
            className="font-medium text-gray-600 transition hover:text-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Page Heading */}
      <section className="bg-blue-700 px-6 py-12 text-center text-white">
        <h1 className="text-3xl font-bold md:text-4xl">
          Contact Us
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-blue-100">
          Have a question about JalMart? Get in touch with us.
        </p>
      </section>

      {/* Contact Information */}
      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-2">
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold">
            Get in Touch
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-blue-700">
                Address
              </h3>
              <p className="mt-1 text-gray-600">
                Church Road, Vasant Kunj, New Delhi, India
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-blue-700">
                Email
              </h3>
              <a
                href="mailto:sanchitjaltare78@gmail.com"
                className="mt-1 inline-block break-all text-gray-600 hover:text-blue-700"
              >
                sanchitjaltare78@gmail.com
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-blue-700">
                Phone
              </h3>
              <a
                href="tel:+919667919955"
                className="mt-1 inline-block text-gray-600 hover:text-blue-700"
              >
                +91 96679 19955
              </a>
            </div>
          </div>

          <p className="mt-8 rounded-lg bg-blue-50 p-4 text-sm text-gray-600">
            We welcome your questions and feedback about JalMart.
          </p>
        </section>

        {/* Map */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="p-6">
            <h2 className="text-2xl font-bold">Find Us</h2>
            <p className="mt-2 text-gray-600">
              View the Church Road area in Vasant Kunj, New Delhi.
            </p>
          </div>

          <iframe
            title="Map of Church Road, Vasant Kunj, New Delhi"
            src="https://maps.google.com/maps?q=Church%20Road%2C%20Vasant%20Kunj%2C%20New%20Delhi&output=embed"
            width="100%"
            height="350"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />

          <div className="p-5">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Church+Road%2C+Vasant+Kunj%2C+New+Delhi"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-700 hover:underline"
            >
              Open in Google Maps →
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 px-6 py-5 text-center text-sm text-gray-300">
        Made by Sanchit Jaltare
      </footer>
    </div>
  );
}

export default ContactPage;
