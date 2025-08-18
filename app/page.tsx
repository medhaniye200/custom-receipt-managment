"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { FaSpinner } from "react-icons/fa";
import { BASE_API_URL } from "./import-api/ImportApi";

interface JwtPayload {
  user_id: string;
  roles: string[];
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textData = await response.text();
        try {
          // Try to parse as JSON in case content-type was wrong
          data = JSON.parse(textData);
        } catch {
          // If not JSON, use as plain text
          data = { message: textData };
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message || (typeof data === "string" ? data : "Login failed")
        );
      }

      const token = data.token;
      if (!token) throw new Error("No token received");

      localStorage.setItem("token", token);

      const decoded = jwtDecode<JwtPayload>(token);
      const userId = decoded.user_id;
      const roles = decoded.roles;

      localStorage.setItem("userId", userId);
      localStorage.setItem("roles", JSON.stringify(roles));

      // Redirect based on role
      if (roles.includes("CLERK")) {
        router.push("/declaration");
      } else if (roles.includes("ACCOUNTANT")) {
        router.push("/accountant-dashboard");
      } else if (roles.includes("USER")) {
        router.push("/owner");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-2xl space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-500">Log in to your account to continue.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 sr-only">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 sr-only">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <div className="text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:underline font-semibold"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
