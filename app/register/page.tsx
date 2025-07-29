"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    companyname: "",
    tinnumber: "",
    email: "",
    phone_number: "",
    wereda: "",
    kebele: "",
    region: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://customreceiptmanagement.onrender.com/api/v1/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.text();
      if (!response.ok) throw new Error(data || "Registration failed");

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
      >
        <h2 className="text-2xl font-bold mb-6 col-span-full text-center">
          Register
        </h2>
        {error && <p className="text-red-500 col-span-full">{error}</p>}

        <div>
          <label className="block text-sm font-semibold mb-1">First Name</label>
          <input
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            type="text"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Last Name</label>
          <input
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            type="text"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Company Name</label>
          <input
            name="companyname"
            value={formData.companyname}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            type="text"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">TIN Number</label>
          <input
            name="tinnumber"
            value={formData.tinnumber}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            type="text"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            type="email"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Phone Number</label>
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            type="tel"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Wereda</label>
          <input
            name="wereda"
            value={formData.wereda}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            type="text"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Kebele</label>
          <input
            name="kebele"
            value={formData.kebele}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            type="text"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Region</label>
          <input
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            type="text"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            type="text"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            type="password"
          />
        </div>

        <div className="col-span-full">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
