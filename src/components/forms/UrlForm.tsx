"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shortenUrl } from "@/services/urlService";
import { startLoading, setShortUrl, setError } from "@/redux/urlSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { Link } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { isValidUrl } from "../../utils/validators";

const UrlForm: React.FC = () => {
  const [longUrl, setLongUrl] = useState<string>("");
  const [customName, setCustomName] = useState<string>("");
  const [showQrCode, setShowQrCode] = useState<boolean>(false);

  const [localError, setLocalError] = useState<string | null>(null);
  const [customNameError, setCustomNameError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { shortUrl, isLoading } = useSelector((state: RootState) => state.url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setCustomNameError(null);

    if (!longUrl.trim()) {
      setLocalError("The URL cannot be empty.");
      return;
    }

    if (!isValidUrl(longUrl)) {
      setLocalError("Please enter a valid URL.");
      return;
    }

    dispatch(startLoading());
    try {
      const shortenedUrl = await shortenUrl(longUrl, customName);
      dispatch(setShortUrl(shortenedUrl));
    } catch (err: any) {
      if (
        err.response?.data?.message === "This custom name is already taken."
      ) {
        dispatch(setError(err.response?.data?.message));
        setCustomNameError(
          "This custom name is already taken. Please try another."
        );
      } else {
        dispatch(
          setError(err.response?.data?.message || "Something went wrong")
        );
      }
    }
  };

  const handleClear = () => {
    setLongUrl("");
    setCustomName("");
    setCustomNameError("");
    setLocalError(null);
    dispatch(setShortUrl(""));
    dispatch(setError(null));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Link size={48} className="text-[#bf43f5]" />
          </div>
          <h1 className="text-3xl font-bold mb-2">URL Shortener</h1>
          <p className="text-gray-600 mb-6">
            Easily shorten your long URLs into simple, shareable links.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter a long URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className={`p-3 border rounded focus:outline-none ${
              localError ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-[#bf43f5]`}
          />
          {localError && <p className="text-red-500 text-sm">{localError}</p>}
          <input
            type="text"
            placeholder="Custom short name (optional)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className={`p-3 border rounded focus:outline-none ${
              customNameError ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-[#bf43f5]`}
          />
          {customNameError && (
            <p className="text-red-500 text-sm">{customNameError}</p>
          )}
          <div className="flex justify-between gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#bf43f5] text-white p-3 rounded hover:bg-[#a137d6] disabled:bg-gray-300"
            >
              {isLoading ? "Shortening..." : "Shorten URL"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 bg-gray-200 text-gray-800 p-3 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </form>
        {shortUrl && (
          <>
            <p className="mt-4 text-gray-800">
              Shortened URL:{" "}
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {shortUrl}
              </a>
            </p>
            <p
              className="mt-2 text-blue-500 underline cursor-pointer text-sm"
              onClick={() => setShowQrCode(!showQrCode)}
            >
              {showQrCode
                ? "Hide the QR code"
                : "Show the QR code of the Shortened URL"}
            </p>
          </>
        )}
        {showQrCode && shortUrl && (
          <div className="mt-6 flex items-center justify-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <QRCodeCanvas value={shortUrl} size={150} className="m-auto" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlForm;
