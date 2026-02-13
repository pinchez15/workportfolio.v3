// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { PostHogPageview } from "./posthog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.workportfolio.io"),
  title: {
    default: "WorkPortfolio.io - Professional Portfolio Builder",
    template: "%s | WorkPortfolio.io",
  },
  description: "Create and share your professional portfolio with ease. Show your work, not just your resume.",
  openGraph: {
    siteName: "WorkPortfolio.io",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Suspense fallback={null}>
            <PostHogPageview />
          </Suspense>

          {children}
        </Providers>
      </body>
    </html>
  );
}
