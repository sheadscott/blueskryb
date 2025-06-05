import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Blueskryb',
  description: 'Privacy policy and cookie information for Blueskryb',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Information We Collect
          </h2>
          <p className="mb-4">
            Blueskryb respects your privacy. We collect information to provide
            and improve our service:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Account information when you sign in with Bluesky</li>
            <li>Books you add to your library</li>
            <li>Usage data to improve our service (with your consent)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
          <p className="mb-4">
            We use different types of cookies to enhance your experience:
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-green-700 mb-2">
              ✓ Necessary Cookies
            </h3>
            <p className="text-sm">
              Required for basic functionality, security, and remembering your
              login status. These cannot be disabled.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-700 mb-2">
              📊 Analytics Cookies
            </h3>
            <p className="text-sm">
              Help us understand how you use our site to improve the experience.
              We use PostHog for privacy-focused analytics. You can opt out
              anytime.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-purple-700 mb-2">
              📈 Marketing Cookies
            </h3>
            <p className="text-sm">
              Used to show relevant content and understand campaign
              effectiveness. Currently not implemented.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of analytics tracking</li>
            <li>Change your cookie preferences anytime</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
          <p className="mb-4">
            We do not sell your personal information. We may share data with:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Bookshop.org:</strong> When you click affiliate links
              (ISBN only)
            </li>
            <li>
              <strong>PostHog:</strong> Anonymous usage analytics (if you
              consent)
            </li>
            <li>
              <strong>Supabase:</strong> Secure database hosting
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4">
            Questions about privacy? Contact us at{' '}
            <a
              href="mailto:privacy@blueskryb.cloud"
              className="text-blue-600 hover:underline"
            >
              privacy@blueskryb.cloud
            </a>
          </p>
        </section>

        <div className="mt-12 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You can change your cookie preferences at any
            time by clearing your browser data and revisiting our site, or by
            contacting us.
          </p>
        </div>
      </div>
    </div>
  )
}
