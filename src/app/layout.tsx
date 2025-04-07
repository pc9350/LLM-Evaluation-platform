import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { ClientMigration } from '@/components/ClientMigration';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LLM Evaluation Platform",
  description: "Compare and evaluate different LLM models in real-time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <Navbar />
        <ClientMigration />
        <main className="pt-20">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}