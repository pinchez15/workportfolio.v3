import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-900">WorkPortfolio.io</Link>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-blue-600 font-medium">Privacy</Link>
            <Link href="/terms" className="text-slate-600 hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-black text-neutral-900 mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-black text-neutral-900 mb-4">Information We Collect</h2>
            <p className="text-slate-600 mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              upload content, or contact us for support.
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Account information (name, email, username)</li>
              <li>Portfolio content and projects you upload</li>
              <li>Usage data and analytics</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-neutral-900 mb-4">How We Use Your Information</h2>
            <p className="text-slate-600 mb-4">
              We use the information we collect to provide, maintain, and improve our services:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Provide and maintain your portfolio</li>
              <li>Process payments and subscriptions</li>
              <li>Send you important updates and notifications</li>
              <li>Improve our services and user experience</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-neutral-900 mb-4">Information Sharing</h2>
            <p className="text-slate-600">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-neutral-900 mb-4">Data Security</h2>
            <p className="text-slate-600">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-neutral-900 mb-4">Your Rights</h2>
            <p className="text-slate-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Request data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-neutral-900 mb-4">Contact Us</h2>
            <p className="text-slate-600">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@workportfolio.io" className="text-blue-600 hover:underline">
                privacy@workportfolio.io
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-neutral-900 mb-4">Updates to This Policy</h2>
            <p className="text-slate-600">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
            </p>
            <p className="text-slate-500 text-sm mt-4">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
} 