"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginUser } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser({
        email: email.trim(),
        password,
      });

      // Backend returns `accessToken`
      if (!result.accessToken) {
        setError(
          "Login succeeded but no access token was returned.",
        );
        return;
      }

      // Store authentication state
      setAuth(
        result.accessToken,
        result.user,
      );

      // Redirect to protected dashboard
      router.replace("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);

      const message =
        error?.response?.data?.message;

      if (Array.isArray(message)) {
        setError(message.join(", "));
      } else {
        setError(
          message ||
            "Invalid email or password.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8">

          {/* HEADER */}

          <div className="mb-6 sm:mb-8">

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Login to manage your tasks.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-3 py-3 sm:px-4 text-sm text-red-700 break-words">
              {error}
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-3 sm:px-4 text-gray-900 placeholder:text-gray-500 outline-none focus:border-gray-900 text-sm sm:text-base"
                disabled={loading}
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Your password"
                autoComplete="current-password"
                className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-3 sm:px-4 text-gray-900 placeholder:text-gray-500 outline-none focus:border-gray-900 text-sm sm:text-base"
                disabled={loading}
              />

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50 text-sm sm:text-base"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          {/* REGISTER LINK */}

          <p className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-gray-600 leading-6">
            Don't have an account?{" "}

            <Link
              href="/register"
              className="font-semibold text-gray-900 hover:underline"
            >
              Create account
            </Link>
          </p>

        </div>

      </div>

    </main>
  );
}