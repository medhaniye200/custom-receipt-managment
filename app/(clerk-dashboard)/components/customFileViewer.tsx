"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Download, X, Eye, ChevronDown, File, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { BASE_API_URL } from "../../import-api/ImportApi";

// ---------------- Interfaces ----------------
interface DocumentFile {
  label: string;
  base64Data: string;
}

interface UserDocument {
  userId: string;
  firstname: string;
  lastname: string;
  tinNumber: string;
  companyname: string;
  documents: DocumentFile[];
}

interface ApiDocumentItem {
  userId: string;
  firstname: string;
  lastname: string;
  tinNumebr: string;
  companyname: string;
  imagebaseCustomfile?: string;
  imagebaseBankPermitfile?: string;
  imageCummercialInvoicefile?: string;
}

// ---------------- Helper Functions ----------------
const createDataUrl = (
  base64String: string | undefined | null,
  label: string
): string => {
  if (!base64String) return "";

  if (base64String.startsWith("data:")) {
    return base64String;
  }

  let mimeType = "";
  if (
    label.toLowerCase().includes("image") ||
    label.toLowerCase().includes("custom file")
  ) {
    mimeType = "image/jpeg";
  } else if (
    label.toLowerCase().includes("permit") ||
    label.toLowerCase().includes("invoice") ||
    label.toLowerCase().includes("pdf")
  ) {
    mimeType = "application/pdf";
  } else {
    console.warn(
      `Unknown document type for label: "${label}". Defaulting to "application/octet-stream".`
    );
    mimeType = "application/octet-stream";
  }

  const cleanedBase64 = base64String
    .replace(/^data:image\/\w+;base64,/, "")
    .replace(/\s/g, "");

  try {
    window.atob(cleanedBase64);
    return `data:${mimeType};base64,${cleanedBase64}`;
  } catch (e) {
    console.error("Invalid base64 string for:", label);
    return "";
  }
};

// ---------------- FilePreview Component ----------------
function FilePreview({
  label,
  url,
  onPreviewClick,
}: {
  label: string;
  url: string;
  onPreviewClick: (url: string, label: string) => void;
}) {
  // --- Check for empty URL at the start of the component ---
  if (!url) {
    return (
      <div className="bg-gray-100 p-4 rounded shadow flex flex-col justify-between">
        <h3 className="text-md font-semibold mb-2">{label}</h3>
        <p className="text-gray-500">No file available.</p>
      </div>
    );
  }

  const isImage = url.startsWith("data:image");
  const isPdf = url.startsWith("data:application/pdf");

  const handleDownload = () => {
    try {
      const parts = url.split(",");
      const meta = parts[0];
      const base64Content = parts[1]?.replace(/\s/g, "") || "";
      const mimeTypeMatch = meta.match(/^data:(.*?);/);
      const mimeType = mimeTypeMatch
        ? mimeTypeMatch[1]
        : "application/octet-stream";

      const binaryString = atob(base64Content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
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
      console.error("Download failed:", error);
      alert("Download failed.");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow flex flex-col justify-between">
      <div>
        <h3 className="text-md font-semibold mb-2">{label}</h3>
        <div
          className="w-full h-48 rounded cursor-pointer overflow-hidden flex items-center justify-center bg-gray-200"
          onClick={() => onPreviewClick(url, label)}
        >
          {isImage ? (
            <div className="relative w-full h-full">
              <Image
                src={url}
                alt={label}
                fill
                className="object-contain"
                unoptimized={true}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/image-error-placeholder.png";
                }}
              />
            </div>
          ) : isPdf ? (
            <p className="text-blue-600 text-center p-4 flex items-center gap-2">
              <File size={20} /> Click to view PDF
            </p>
          ) : (
            <p className="text-gray-500">Unsupported file format</p>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 gap-2">
        {(isImage || isPdf) && (
          <button
            onClick={() => onPreviewClick(url, label)}
            className="flex-1 flex items-center justify-center gap-2 text-sm text-purple-600 hover:underline bg-purple-50 py-2 rounded cursor-pointer"
          >
            <Eye size={16} /> View
          </button>
        )}
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 text-sm text-blue-600 hover:underline bg-blue-50 py-2 rounded cursor-pointer"
        >
          <Download size={16} /> Download
        </button>
      </div>
    </div>
  );
}

// ---------------- Main Component ----------------
export default function CustomFileViewer() {
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    label: string;
  } | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  const handleOpenPreview = (url: string, label: string) => {
    setPreviewFile({ url, label });
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  const toggleExpand = (tinNumber: string) => {
    setExpandedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tinNumber)) {
        newSet.delete(tinNumber);
      } else {
        newSet.add(tinNumber);
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
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get<ApiDocumentItem[]>(
          `${BASE_API_URL}/api/v1/clerk/customfileAll`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const rawData = response.data;
        const grouped: Record<string, UserDocument> = {};

        rawData.forEach((item) => {
          const tinNumber = item.tinNumebr;
          if (!grouped[tinNumber]) {
            grouped[tinNumber] = {
              userId: item.userId,
              firstname: item.firstname,
              lastname: item.lastname,
              tinNumber: item.tinNumebr,
              companyname: item.companyname,
              documents: [],
            };
          }

          if (item.imagebaseCustomfile) {
            const url = createDataUrl(item.imagebaseCustomfile, "Custom File");
            if (url) {
              grouped[tinNumber].documents.push({
                label: "Custom File",
                base64Data: url,
              });
            }
          }
          if (item.imagebaseBankPermitfile) {
            const url = createDataUrl(
              item.imagebaseBankPermitfile,
              "Bank Permit File"
            );
            if (url) {
              grouped[tinNumber].documents.push({
                label: "Bank Permit File",
                base64Data: url,
              });
            }
          }
          if (item.imageCummercialInvoicefile) {
            const url = createDataUrl(
              item.imageCummercialInvoicefile,
              "Commercial Invoice File"
            );
            if (url) {
              grouped[tinNumber].documents.push({
                label: "Commercial Invoice File",
                base64Data: url,
              });
            }
          }
        });

        setUserDocuments(Object.values(grouped));
      } catch (err: unknown) {
        console.error("Error fetching files:", err);
        let errorMessage =
          "An unexpected error occurred while fetching documents.";

        if (axios.isAxiosError(err)) {
          errorMessage =
            err.response?.data?.message ||
            err.message ||
            `HTTP error! status: ${err.response?.status}`;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-xl text-blue-600">
        <svg
          className="animate-spin h-5 w-5 mr-3 text-blue-500"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
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

  if (previewFile) {
    const isImage = previewFile.url.startsWith("data:image");
    const isPdf = previewFile.url.startsWith("data:application/pdf");

    return (
      <div className="p-4 bg-white rounded-lg shadow-lg h-full flex flex-col">
        <div className="flex items-center gap-4 border-b pb-4 mb-4">
          <button
            onClick={handleClosePreview}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold">{previewFile.label} Preview</h2>
        </div>
        <div className="flex-grow overflow-auto">
          {isImage ? (
            <div className="relative w-full h-full">
              <Image
                src={previewFile.url}
                alt={previewFile.label}
                fill
                className="object-contain"
                unoptimized={true}
              />
            </div>
          ) : isPdf ? (
            <iframe
              src={previewFile.url}
              className="w-full h-full border-none"
              title={`${previewFile.label} Preview`}
            />
          ) : (
            <p className="text-red-600 text-center py-10">
              Unsupported format: {previewFile.label}
            </p>
          )}
        </div>
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
            key={user.tinNumber}
            className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100"
          >
            <button
              onClick={() => toggleExpand(user.tinNumber)}
              className="w-full flex justify-between items-center text-left py-4 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div>
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {user.companyname}
                  </h3>
                  <span className="text-sm text-gray-500 font-medium">
                    (TIN: {user.tinNumber})
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  User: {user.firstname} {user.lastname}
                </p>
              </div>
              <ChevronDown
                className={`text-gray-400 transition-transform duration-300 ${
                  expandedUsers.has(user.tinNumber) ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedUsers.has(user.tinNumber) && (
              <div className="pt-4 border-t mt-4">
                {user.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    {user.documents.map((doc, index) => (
                      <FilePreview
                        key={`${user.tinNumber}-${doc.label}-${index}`}
                        label={doc.label}
                        url={doc.base64Data}
                        onPreviewClick={handleOpenPreview}
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
