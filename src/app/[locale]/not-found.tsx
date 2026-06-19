import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold tracking-[0.3em] text-gold">404</p>
      <h1 className="mt-3 font-display text-4xl text-navy">Page not found</h1>
      <p className="mt-3 max-w-md text-charcoal/70">The page you are looking for does not exist or has been moved.</p>
      <Link href="/" className="mt-8 rounded-lg bg-gold px-6 py-3 font-semibold text-navy transition-opacity hover:opacity-90">
        Back to Home
      </Link>
    </div>
  );
}