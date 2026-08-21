"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { registerUser } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuth();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters.",
      );
      return;
    }

    try {
      setLoading(true);

      const result = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.accessToken) {
        setAuth(
          result.accessToken,
          result.user,
        );

        router.replace("/dashboard");
        return;
      }

      router.replace("/login");
    } catch (error: any) {
      const message =
        error?.response?.data?.message;

      if (Array.isArray(message)) {
        setError(message.join(", "));
      } else {
        setError(
          message ||
            "Registration failed. Please try again.",
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
              Create account
            </h1>

            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Create your TaskFlow account.
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

            {/* NAME */}

            <div>

              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Your name"
                autoComplete="name"
                className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-3 sm:px-4 text-gray-900 placeholder:text-gray-500 outline-none focus:border-gray-900 text-sm sm:text-base"
                disabled={loading}
              />

            </div>

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
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
                className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-3 sm:px-4 text-gray-900 placeholder:text-gray-500 outline-none focus:border-gray-900 text-sm sm:text-base"
                disabled={loading}
              />

            </div>

            {/* CREATE ACCOUNT BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50 text-sm sm:text-base"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          {/* LOGIN LINK */}

          <p className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-gray-600 leading-6">
            Already have an account?{" "}

            <Link
              href="/login"
              className="font-semibold text-gray-900 hover:underline"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </main>
  );
}