import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-900">WorkPortfolio.io</Link>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-slate-600 hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="text-blue-600 font-medium">Terms</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-slate-600">
              By accessing and using WorkPortfolio.io, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do 
              not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p className="text-slate-600 mb-4">
              Permission is granted to temporarily use WorkPortfolio.io for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title, and 
              under this license you may not:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on WorkPortfolio.io</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Content</h2>
            <p className="text-slate-600 mb-4">
              You retain ownership of any content you upload to WorkPortfolio.io. By uploading content, 
              you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and 
              display your content solely for the purpose of providing our services.
            </p>
            <p className="text-slate-600">
              You are responsible for ensuring that your content does not violate any third-party 
              rights or applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Prohibited Uses</h2>
            <p className="text-slate-600 mb-4">
              You may not use WorkPortfolio.io to:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Upload illegal, harmful, or offensive content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
            <p className="text-slate-600">
              We strive to maintain high availability of our services, but we do not guarantee 
              uninterrupted access. We may temporarily suspend or terminate services for maintenance, 
              updates, or other reasons.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-slate-600">
              In no event shall WorkPortfolio.io or its suppliers be liable for any damages arising 
              out of the use or inability to use the materials on our website, even if we or an 
              authorized representative has been notified orally or in writing of the possibility 
              of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Privacy</h2>
            <p className="text-slate-600">
              Your privacy is important to us. Please review our Privacy Policy, which also governs 
              your use of the service, to understand our practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="text-slate-600">
              We may terminate or suspend your account and access to our services at any time, 
              without prior notice, for conduct that we believe violates these Terms of Service 
              or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-slate-600">
              We reserve the right to modify these terms at any time. We will notify users of any 
              material changes by posting the new Terms of Service on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-slate-600">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@workportfolio.io" className="text-blue-600 hover:underline">
                legal@workportfolio.io
              </a>
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