import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "A simple URL shortening service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-800 antialiased">
        <div className="container mx-auto p-4">{children}</div>
      </body>
    </html>
  );
}
