import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "@/components/AuthGuard";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CareerFit - AI Resume Analyzer",
  description: "Analyze your resume against job descriptions using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 flex flex-col`}>
        <AuthGuard>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </AuthGuard>
      </body>
    </html>
  );
}
