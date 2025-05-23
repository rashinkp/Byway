// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { GoogleOAuthProvider } from "@react-oauth/google";
import BywayFooter from "@/components/Footer";
import { LoadingProvider } from "@/lib/context/LoadingContext";
import { Loading } from "@/components/GlobalLoading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Byway",
  description: "Learn and Teach Online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <LoadingProvider>
          <Providers>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
            >
              <Loading />
              <div className="flex-1">{children}</div>
              <BywayFooter />
            </GoogleOAuthProvider>
          </Providers>
          <Toaster richColors position="top-right" />
        </LoadingProvider>
      </body>
    </html>
  );
}
