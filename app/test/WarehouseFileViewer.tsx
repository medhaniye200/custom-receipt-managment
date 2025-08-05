"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AtSign, File, Download, X, Eye, ChevronDown, ArrowLeft } from "lucide-react";

// The data structure returned by the API
interface RawWarehouseFile {
  userId: string;
  tinNumber: string;
  firstName: string;
  lastname: string;
  maintype: string;
  withHoldihType: string;
  companyName: string;
  imageBaseMainReceipt: string;
  imageBaseWithholidingReceipt: string;
}

// A helper interface to group documents for display
interface UserDocument {
  userId: string;
  firstName: string;
  lastname: string;
  tinNumber: string;
  companyName: string;
  documents: DocumentFile[];
}

interface DocumentFile {
  label: string;
  base64Data: string; // The data URI
}

const BASE_URL = "https://customreceiptmanagement.onrender.com";

// Helper function to create a data URI with a default MIME type if needed
const createDataUrl = (
  base64String: string | null | undefined,
  label: string
): string => {
  if (!base64String) return "";
  if (base64String.startsWith("data:")) return base64String;

  // Determine MIME type based on label as a fallback
  let mimeType = "image/jpeg"; // A common default
  if (label.toLowerCase().includes("receipt")) {
    mimeType = "image/jpeg";
  } else if (label.toLowerCase().includes("pdf")) {
    mimeType = "application/pdf";
  }

  return `data:${mimeType};base64,${base64String}`;
};

// New component for the in-column preview
function InColumnFilePreview({ fileUrl, fileLabel, onClose }: { fileUrl: string; fileLabel: string; onClose: () => void; }) {
  const isImage = fileUrl.startsWith("data:image");
  const isPdf = fileUrl.startsWith("data:application/pdf");

  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-xl font-bold text-gray-800">{fileLabel}</h3>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Documents
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {isImage ? (
          <img src={fileUrl} alt={fileLabel} className="max-w-full h-auto mx-auto object-contain" />
        ) : isPdf ? (
          <iframe src={fileUrl} className="w-full h-full border-none" title={`${fileLabel} Preview`} />
        ) : (
          <p className="text-red-600 text-center py-10">
            Unsupported file format for preview.
          </p>
        )}
      </div>
    </div>
  );
}

// FilePreview component with download and view buttons
function FilePreview({
  label,
  url,
  onPreviewClick,
}: {
  label: string;
  url: string;
  onPreviewClick: (url: string, label: string) => void;
}) {
  // Existing FilePreview component logic (unchanged)
  if (!url) {
    return (
      <div className="bg-gray-100 p-4 rounded shadow flex flex-col justify-between">
        <div>
          <h3 className="text-md font-semibold mb-2">{label}</h3>
          <p className="text-gray-500">No file available for this document.</p>
        </div>
        <button
          className="mt-4 flex items-center justify-center gap-2 text-gray-400 bg-gray-200 py-2 rounded cursor-not-allowed"
          disabled
        >
          <Download size={16} /> Download
        </button>
      </div>
    );
  }

  const isImage = url.startsWith("data:image");
  const isPdf = url.startsWith("data:application/pdf");

  const handleDownload = () => {
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${label.replace(/[^a-zA-Z0-9]/g, "_")}.${
        isPdf ? "pdf" : "jpg"
      }`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error during client-side download:", error);
      alert("Failed to download file.");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow flex flex-col justify-between">
      <div>
        <h3 className="text-md font-semibold mb-2">{label}</h3>
        <div
          className="w-full h-48 rounded cursor-pointer overflow-hidden flex items-center justify-center bg-gray-200"
          onClick={() => (isImage || isPdf) && onPreviewClick(url, label)}
        >
          {isImage && (
            <img
              src={url}
              alt={label}
              className="w-full h-full object-contain"
            />
          )}
          {isPdf && (
            <p className="text-blue-600 text-center p-4 flex items-center gap-2">
              <File size={20} /> Click to view PDF
            </p>
          )}
          {!isImage && !isPdf && (
            <p className="text-red-500 text-center">No preview available</p>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 gap-2">
        {(isImage || isPdf) && (
          <button
            onClick={() => onPreviewClick(url, label)}
            className="flex-1 flex items-center justify-center gap-2 text-purple-600 hover:underline bg-purple-50 py-2 rounded cursor-pointer"
          >
            <Eye size={16} /> View
          </button>
        )}
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 text-blue-600 hover:underline bg-blue-50 py-2 rounded cursor-pointer"
        >
          <Download size={16} /> Download
        </button>
      </div>
    </div>
  );
}

// Main component to fetch and display warehouse files
export default function WarehouseFileViewer() {
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state for in-column preview
  const [previewFile, setPreviewFile] = useState<{ url: string; label: string } | null>(null);

  // New state to track expanded users
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  // Function to handle in-column preview
  const openPreview = (url: string, label: string) => {
    setPreviewFile({ url, label });
  };

  // Function to close in-column preview
  const closePreview = () => {
    setPreviewFile(null);
  };

  // New function to toggle the expanded state
  const toggleExpand = (userId: string) => {
    setExpandedUsers((prevExpandedUsers) => {
      const newSet = new Set(prevExpandedUsers);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    // Existing useEffect logic to fetch files (unchanged)
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get<RawWarehouseFile[]>(
          `${BASE_URL}/api/v1/clerk/wareHousefileAll`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const rawData = response.data;
        console.log("Fetched Raw Data:", rawData);

        const grouped: Record<string, UserDocument> = {};

        rawData.forEach((item) => {
          const userId = item.userId;

          if (!grouped[userId]) {
            grouped[userId] = {
              userId,
              firstName: item.firstName,
              lastname: item.lastname,
              tinNumber: item.tinNumber,
              companyName: item.companyName,
              documents: [],
            };
          }

          if (item.imageBaseMainReceipt) {
            grouped[userId].documents.push({
              label: `${item.maintype} Receipt`,
              base64Data: createDataUrl(
                item.imageBaseMainReceipt,
                `${item.maintype} Receipt`
              ),
            });
          }

          if (item.imageBaseWithholidingReceipt) {
            grouped[userId].documents.push({
              label: `${item.withHoldihType} Withholding Receipt`,
              base64Data: createDataUrl(
                item.imageBaseWithholidingReceipt,
                `${item.withHoldihType} Withholding Receipt`
              ),
            });
          }
        });

        setUserDocuments(Object.values(grouped));
      } catch (err) {
        console.error("Error fetching files:", err);
        if (axios.isAxiosError(err) && err.response) {
          setError(
            `Failed to fetch documents: ${err.response.status} - ${
              err.response.data.message || err.response.statusText
            }`
          );
        } else {
          setError("An unexpected error occurred while fetching documents.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-blue-600">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
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
        Loading documents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-600 border border-red-300 bg-red-50 rounded-md mx-auto max-w-md mt-10">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Warehouse File Viewer
      </h2>
      {previewFile ? (
        <InColumnFilePreview
          fileUrl={previewFile.url}
          fileLabel={previewFile.label}
          onClose={closePreview}
        />
      ) : userDocuments.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10">
          No warehouse documents available.
        </p>
      ) : (
        userDocuments.map((user) => (
          <div
            key={user.userId}
            className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100"
          >
            {/* The main button to toggle the view */}
            <button
              onClick={() => toggleExpand(user.userId)}
              className="w-full flex justify-between items-center text-left py-4 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div>
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {user.companyName}
                  </h3>
                  <span className="text-sm text-gray-500 font-medium">
                    (TIN: {user.tinNumber})
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  User: {user.firstName} {user.lastname}
                </p>
              </div>
              <ChevronDown
                className={`text-gray-400 transition-transform duration-300 ${
                  expandedUsers.has(user.userId) ? "rotate-180" : ""
                }`}
              />
            </button>
            {/* The collapsible content section */}
            {expandedUsers.has(user.userId) && (
              <div className="pt-4 border-t mt-4">
                {user.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                    {user.documents.map((doc, docIndex) => (
                      <FilePreview
                        key={docIndex}
                        label={doc.label}
                        url={doc.base64Data}
                        onPreviewClick={openPreview}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 italic text-center py-4">
                    No specific files uploaded for this user.
                  </p>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}