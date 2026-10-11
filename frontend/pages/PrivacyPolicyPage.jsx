
import { Link } from "react-router-dom";

function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-3 text-blue-100">
          Your privacy matters to us.
        </p>
      </section>

      {/* Policy Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <article className="space-y-8 rounded-2xl bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm text-gray-500">
            Last updated: October 11, 2026
          </p>

          <section>
            <h2 className="mb-3 text-xl font-bold">
              1. Introduction
            </h2>
            <p className="leading-7 text-gray-600">
              Welcome to JalMart. This Privacy Policy explains how
              information may be handled when you visit or use our
              website. We aim to be transparent about the information
              associated with your use of the website.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">
              2. Information We May Collect
            </h2>
            <p className="leading-7 text-gray-600">
              Depending on the features you use, information may include
              details you provide directly, such as contact or order
              information, and technical information generated when you
              access the website. The information actually collected
              depends on the features enabled on JalMart.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">
              3. How Information May Be Used
            </h2>
            <p className="leading-7 text-gray-600">
              Information may be used to operate the website, display
              products, support shopping-related features, respond to
              enquiries, maintain website functionality, and address
              technical issues where applicable.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">
              4. Cookies and Technical Data
            </h2>
            <p className="leading-7 text-gray-600">
              The website or its hosting infrastructure may use cookies
              or similar technologies where needed for functionality.
              Browser settings can provide options for managing cookies,
              although disabling them may affect some website features.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">
              5. Data Sharing
            </h2>
            <p className="leading-7 text-gray-600">
              Information may be processed by service providers involved
              in hosting or operating the website when applicable.
              Any additional sharing should depend on the services
              actually used and the requirements of applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">
              6. Data Security and Retention
            </h2>
            <p className="leading-7 text-gray-600">
              Reasonable safeguards should be used to protect
              information handled by the website. No online system can
              be guaranteed completely secure. Information should be
              retained only as long as reasonably necessary for its
              purpose or as required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">
              7. Your Choices and Requests
            </h2>
            <p className="leading-7 text-gray-600">
              You can contact us with questions about privacy or
              requests concerning information you have provided.
              Requests will be handled subject to applicable law and
              the information and capabilities available to us.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">
              8. Third-Party Services
            </h2>
            <p className="leading-7 text-gray-600">
              Links or embedded content from third-party services,
              such as map providers, may be governed by those providers'
              own privacy policies. Please review their policies when
              using their services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">
              9. Changes to This Policy
            </h2>
            <p className="leading-7 text-gray-600">
              This policy may be updated as JalMart's features or
              practices change. Updates should be reflected on this
              page with a revised date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">
              10. Contact Us
            </h2>
            <p className="leading-7 text-gray-600">
              For privacy-related questions, contact us at:
            </p>
            <a
              href="mailto:sanchitjaltare78@gmail.com"
              className="mt-2 inline-block break-all font-medium text-blue-700 hover:underline"
            >
              sanchitjaltare78@gmail.com
            </a>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 px-6 py-5 text-center text-sm text-gray-300">
        Made by Sanchit Jaltare
      </footer>
    </div>
  );
}

export default PrivacyPage;
