import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "@/components/AuthGuard";
import { Navbar } from "@/components/Navbar";
import { PublicThemeToggle } from "@/components/PublicThemeToggle";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-950 flex flex-col dark:bg-slate-950 dark:text-slate-100`}>
        <ThemeProvider>
          <AuthGuard>
            <PublicThemeToggle />
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
