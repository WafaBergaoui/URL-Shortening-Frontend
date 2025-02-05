"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shortenUrl } from "@/services/urlService";
import { startLoading, setShortUrl, setError } from "@/redux/urlSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { Link } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

// Helper function to validate URL
const isValidUrl = (url: string): boolean => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)" + // Protocol
      "((([a-zA-Z0-9\\-]+)\\.)+[a-zA-Z]{2,})" + // Domain name
      "(\\:[0-9]{1,5})?" + // Optional port
      "(\\/.*)?$", // Optional path
    "i"
  );
  return !!urlPattern.test(url);
};

const UrlForm: React.FC = () => {
  const [longUrl, setLongUrl] = useState<string>("");
  const [localError, setLocalError] = useState<string | null>(null); // Local error for invalid input

  const dispatch = useDispatch<AppDispatch>();
  const { shortUrl, isLoading, error } = useSelector(
    (state: RootState) => state.url
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null); // Clear previous local errors

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
      const shortenedUrl = await shortenUrl(longUrl);
      dispatch(setShortUrl(shortenedUrl));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || "Something went wrong"));
    }
  };

  const handleClear = () => {
    setLongUrl("");
    setLocalError(null);
    dispatch(setShortUrl("")); // Clear the Redux state for the short URL
    dispatch(setError(null)); // Clear the Redux state for error
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
        )}
        {shortUrl && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-[#bf43f5] mb-4">
              Your QR Code
            </h2>
            <QRCodeCanvas value={shortUrl} size={120} />
          </div>
        )}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default UrlForm;
