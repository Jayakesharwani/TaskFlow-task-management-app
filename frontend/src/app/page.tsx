import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          TaskFlow
        </h1>

        <p className="mt-3 text-gray-600">
          Manage your tasks securely and efficiently.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-gray-900 px-6 py-3 text-white font-medium hover:bg-gray-800"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-900 font-medium hover:bg-gray-50"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}