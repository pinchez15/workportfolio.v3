import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-slate-300">404</h1>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-slate-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <Link 
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
} 