import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InkFinite - Infinite Canvas",
  description: "A modern infinite canvas for visual note-taking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
