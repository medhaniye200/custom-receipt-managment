"use client";
import { useState, useEffect } from "react";

// const STORAGE_KEY = "myFormDraft";

export default function SafeForm() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [restored, setRestored] = useState(false);

  // Load saved draft when page loads
  useEffect(() => {
    const saved = localStorage.getItem("forms");
    if (saved) {
      setFormData(JSON.parse(saved));
      setRestored(true); // show message that draft was restored
    }
  }, []);

  // Save draft locally whenever form changes
  useEffect(() => {
    localStorage.setItem("forms", JSON.stringify(formData));
  }, [formData]);

  // Submit to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:3001/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      alert("Saved to DB ✅");
      localStorage.removeItem("forms"); // clear draft after saving
    } catch (err) {
      alert("Save failed ❌ (but draft is still safe locally)");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded w-80">
      {restored && (
        <p className="text-green-600 text-sm mb-2">
          Draft restored after restart ✅
        </p>
      )}
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="border p-2 mb-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Save to DB
      </button>
    </form>
  );
}
