"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa";

interface DocumentFile {
  label: string;
  base64Data: string; // This will always include the data URI prefix (e.g., data:image/jpeg;base64,...)
}

interface UserDocument {
  userId: string;
  firstname: string;
  lastname: string;
  tinNumebr: string;
  companyname: string;
  documents: DocumentFile[];
}

const BASE_URL = "https://customreceiptmanagement.onrender.com";

// Helper function to ensure the base64 string has the correct data URI prefix
const createDataUrl = (
  base64String: string | null | undefined,
  label: string
): string => {
  if (!base64String) return ""; // Handle null/undefined/empty strings gracefully

  // If the base64String already starts with 'data:', assume it's complete
  if (base64String.startsWith("data:")) {
    return base64String;
  }

  // Determine MIME type based on label as a fallback heuristic
  let mimeType = "";
  if (
    label.toLowerCase().includes("image") ||
    label.toLowerCase().includes("custom file")
  ) {
    mimeType = "image/jpeg"; // Common default for images
  } else if (
    label.toLowerCase().includes("permit") ||
    label.toLowerCase().includes("invoice") ||
    label.toLowerCase().includes("pdf")
  ) {
    mimeType = "application/pdf";
  } else {
    // If we can't determine, use a generic binary type and log a warning
    console.warn(
      `Unknown document type for label: "${label}". Defaulting to "application/octet-stream".`
    );
    mimeType = "application/octet-stream";
  }

  return `data:${mimeType};base64,${base64String}`;
};

// New: PreviewModal Component
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
            &times;
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
              sandbox="allow-scripts allow-same-origin allow-popups allow-downloads"
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

// FilePreview component with a "View" button for the modal
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
          className="mt-4 block text-gray-400 bg-gray-200 py-2 rounded cursor-not-allowed"
          disabled
        >
          Download {label}
        </button>
      </div>
    );
  }

  const isImage = url.startsWith("data:image");
  const isPdf = url.startsWith("data:application/pdf");

  // Function to handle client-side download using Blob API
  const handleDownload = () => {
    try {
      if (!url || !url.includes(",")) {
        console.error(
          "Invalid data URL format for download (missing comma or empty URL):",
          url
        );
        alert("Cannot download file: Invalid data format.");
        return;
      }

      const parts = url.split(",");
      const meta = parts[0];
      const base64Content = parts[1] ? parts[1].replace(/\s/g, "") : "";
      const mimeTypeMatch = meta.match(/^data:(.*?);/);
      const mimeType = mimeTypeMatch
        ? mimeTypeMatch[1]
        : "application/octet-stream";

      if (!base64Content) {
        console.error(
          "Base64 content is empty after splitting and cleaning:",
          url
        );
        alert("Cannot download: File data is missing or corrupted.");
        return;
      }

      const binaryString = atob(base64Content);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${label.replace(/[^a-zA-Z0-9]/g, "_")}.${
        mimeType.split("/")[1] || "file"
      }`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error("Error during client-side download:", error);
      alert(
        `Failed to download file: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Please check console for details.`
      );
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow flex flex-col justify-between">
      <div>
        <h3 className="text-md font-semibold mb-2">{label}</h3>
        {isImage || isPdf ? (
          <div
            className="w-full h-48 rounded cursor-pointer overflow-hidden flex items-center justify-center bg-gray-200"
            onClick={() => onPreviewClick(url, label)}
          >
            {isImage && (
              <img
                src={url}
                alt={label}
                className="w-full h-full object-contain"
              />
            )}
            {isPdf && (
              <p className="text-blue-600 text-center p-4">Click to view PDF</p>
            )}
          </div>
        ) : (
          <p className="text-red-500">
            Unsupported file format for preview. Cannot display.
          </p>
        )}
      </div>
      <div className="flex justify-between items-center mt-4 gap-2">
        {(isImage || isPdf) && (
          <button
            onClick={() => onPreviewClick(url, label)}
            className="flex-1 text-purple-600 hover:underline text-center bg-purple-50 py-2 rounded cursor-pointer"
          >
            View {label}
          </button>
        )}
        <button
          onClick={handleDownload}
          className="flex-1 text-blue-600 hover:underline text-center bg-blue-50 py-2 rounded cursor-pointer"
        >
          Download {label}
        </button>
      </div>
    </div>
  );
}

// CustomFileViewer component to fetch and group documents
export default function CustomFileViewer() {
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalFileUrl, setModalFileUrl] = useState("");
  const [modalFileLabel, setModalFileLabel] = useState("");

  // New state to track expanded users
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

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
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/api/v1/clerk/customfileAll`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const rawData = response.data;
        console.log("Fetched Raw Data:", rawData);

        const grouped: Record<string, UserDocument> = {};
        rawData.forEach((item: any) => {
          const userId = item.userId;
          if (!grouped[userId]) {
            grouped[userId] = {
              userId,
              firstname: item.firstname,
              lastname: item.lastname,
              tinNumebr: item.tinNumebr,
              companyname: item.companyname,
              documents: [],
            };
          }
          if (item.imagebaseCustomfile) {
            grouped[userId].documents.push({
              label: "Custom File",
              base64Data: createDataUrl(item.imagebaseCustomfile, "Custom File"),
            });
          }
          if (item.imagebaseBankPermitfile) {
            grouped[userId].documents.push({
              label: "Bank Permit File",
              base64Data: createDataUrl(item.imagebaseBankPermitfile, "Bank Permit File"),
            });
          }
          if (item.imageCummercialInvoicefile) {
            grouped[userId].documents.push({
              label: "Commercial Invoice File",
              base64Data: createDataUrl(item.imageCummercialInvoicefile, "Commercial Invoice File"),
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
      <div className="text-center p-6 text-xl text-blue-600">
        Loading documents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-600 border border-red-300 bg-red-50 rounded-md mx-auto max-w-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        User Document Viewer
      </h2>
      {userDocuments.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10">
          No documents available for any user.
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
                    {user.companyname}
                  </h3>
                  <span className="text-sm text-gray-500 font-medium">
                    (TIN: {user.tinNumebr})
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  User: {user.firstname} {user.lastname}
                </p>
              </div>
              <FaChevronDown
                className={`text-gray-400 transition-transform duration-300 ${
                  expandedUsers.has(user.userId) ? "rotate-180" : ""
                }`}
              />
            </button>
            {/* The collapsible content section */}
            {expandedUsers.has(user.userId) && (
              <div className="pt-4 border-t mt-4">
                {user.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
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
                  <p className="text-gray-600 italic text-center py-4">
                    No specific files uploaded for this user.
                  </p>
                )}
              </div>
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