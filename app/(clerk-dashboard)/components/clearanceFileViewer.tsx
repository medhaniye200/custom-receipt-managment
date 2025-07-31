"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AtSign, File, Download, X, Eye } from "lucide-react";

// The data structure returned by the API
interface RawClearanceFile {
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
  let mimeType = "image/jpeg"; // A common default for images
  if (label.toLowerCase().includes("receipt")) {
    mimeType = "image/jpeg";
  } else if (label.toLowerCase().includes("pdf")) {
    mimeType = "application/pdf";
  }

  return `data:${mimeType};base64,${base64String}`;
};

// PreviewModal Component (reused from your example)
interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileLabel: string;
}

function PreviewModal({
  isOpen,
  onClose,
  fileUrl,
  fileLabel,
}: PreviewModalProps) {
  if (!isOpen) return null;

  const isImage = fileUrl.startsWith("data:image");
  const isPdf = fileUrl.startsWith("data:application/pdf");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{fileLabel} Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            <X />
          </button>
        </div>
        <div className="flex-grow p-4 overflow-auto">
          {isImage ? (
            <img
              src={fileUrl}
              alt={fileLabel}
              className="max-w-full max-h-full mx-auto object-contain"
            />
          ) : isPdf ? (
            <iframe
              src={fileUrl}
              className="w-full h-full border-none"
              title={`${fileLabel} Preview`}
            />
          ) : (
            <p className="text-red-600 text-center py-10">
              Unsupported file format for detailed preview: {fileLabel}.
            </p>
          )}
        </div>
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
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

// Main component to fetch and display clearance files
export default function ClearanceFileViewer() {
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the preview modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFileUrl, setModalFileUrl] = useState("");
  const [modalFileLabel, setModalFileLabel] = useState("");

  const openPreviewModal = (url: string, label: string) => {
    setModalFileUrl(url);
    setModalFileLabel(label);
    setModalOpen(true);
  };

  const closePreviewModal = () => {
    setModalOpen(false);
    setModalFileUrl("");
    setModalFileLabel("");
  };

  useEffect(() => {
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

        const response = await axios.get<RawClearanceFile[]>(
          `${BASE_URL}/api/v1/clerk/ClearanceFileAll`,
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

          // Dynamically add documents based on the API response structure
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
        Clearance File Viewer
      </h2>
      {userDocuments.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10">
          No clearance documents available.
        </p>
      ) : (
        userDocuments.map((user, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 mb-10 border border-gray-100"
          >
            <h3 className="text-2xl font-bold mb-4 text-purple-700 border-b pb-2">
              {user.firstName} {user.lastname}
            </h3>
            <p className="text-gray-700 mb-4">
              <strong>Company:</strong> {user.companyName}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>TIN Number:</strong> {user.tinNumber}
            </p>

            <p className="text-gray-700 mb-1">
              <strong>User ID:</strong>{" "}
              <span className="font-mono text-sm">{user.userId}</span>
            </p>

            {user.documents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {user.documents.map((doc, docIndex) => (
                  <FilePreview
                    key={docIndex}
                    label={doc.label}
                    url={doc.base64Data}
                    onPreviewClick={openPreviewModal}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 italic mt-4 text-center py-4 border-t border-gray-200">
                No specific files uploaded for this user.
              </p>
            )}
          </div>
        ))
      )}

      <PreviewModal
        isOpen={modalOpen}
        onClose={closePreviewModal}
        fileUrl={modalFileUrl}
        fileLabel={modalFileLabel}
      />
    </div>
  );
}
