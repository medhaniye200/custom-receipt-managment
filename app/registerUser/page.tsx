"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    tinNumber: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://customreceiptmanagement.onrender.com/api/v1/auth/register/", // ✅ use your actual backend here
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      router.push("/login"); // ✅ redirect on success
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-2.5 font-serif">
      <h1 className="text-2xl font-bold mb-6 text-center text-black">
        Company Registration
      </h1>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-black">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-gray-100 text-black"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-black">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-gray-100 text-black"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-black">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-gray-100 text-black"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            minLength={8}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-black">
            Company Name
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-gray-100 text-black"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-black">
            TIN Number
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-gray-100 text-black"
            value={formData.tinNumber}
            onChange={(e) =>
              setFormData({ ...formData, tinNumber: e.target.value })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Register
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-blue-600 hover:underline">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}
