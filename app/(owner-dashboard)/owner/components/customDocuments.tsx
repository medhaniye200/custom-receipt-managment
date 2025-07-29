"use client";

import { useState } from "react";

export default function CustomDocumentsUpload() {
  const [customUploadFile, setCustomUploadFile] = useState<File | null>(null);
  const [bankPermitFile, setBankPermitFile] = useState<File | null>(null);
  const [commercialInvoice, setCommercialInvoice] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!customUploadFile || !bankPermitFile || !commercialInvoice) {
      setStatus("All documents are required.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("customUploadfile", customUploadFile);
    formData.append("bankPermitfile", bankPermitFile);
    formData.append("commercialInvoice", commercialInvoice);

    try {
      const response = await fetch(
        "http://localhost:8000/upload-custom-documents/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setStatus("Documents uploaded successfully!");
        setCustomUploadFile(null);
        setBankPermitFile(null);
        setCommercialInvoice(null);
      } else {
        const errorData = await response.json();
        setStatus(`Upload failed: ${errorData.message || "Please try again"}`);
      }
    } catch (error) {
      setStatus(
        "An error occurred. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUploadField = ({
    file,
    setFile,
    label,
    required = true,
  }: {
    file: File | null;
    setFile: (file: File | null) => void;
    label: string;
    required?: boolean;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-blue-400 cursor-pointer hover:bg-blue-50">
        <div className="flex flex-col items-center justify-center">
          <svg
            className="w-10 h-10 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            {file ? (
              <span className="font-medium text-blue-600">{file.name}</span>
            ) : (
              <>
                <span className="font-medium">Click to upload</span> or drag and
                drop
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 5MB</p>
        </div>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
          required={required}
        />
      </label>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Upload Custom Documents
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FileUploadField
          file={customUploadFile}
          setFile={setCustomUploadFile}
          label="Custom Upload File"
        />

        <FileUploadField
          file={bankPermitFile}
          setFile={setBankPermitFile}
          label="Bank Permit File"
        />

        <FileUploadField
          file={commercialInvoice}
          setFile={setCommercialInvoice}
          label="Commercial Invoice"
        />

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Upload Documents
              </>
            )}
          </button>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`p-3 rounded-md text-center ${
              status.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </div>
        )}
      </form>
    </div>
  );
}
