import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ScriptAI — Premium AI Article & Content Generator",
    template: "%s | ScriptAI",
  },
  description: "Generate publication-ready, SEO-optimized articles in seconds with state-of-the-art AI workflows.",
  keywords: ["AI Article Generator", "Content Writing", "SEO Optimization", "ScriptAI", "Next.js AI", "n8n Webhook"],
  authors: [{ name: "ScriptAI Team" }],
  creator: "ScriptAI Inc.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://scriptai-article-generator.vercel.app",
    title: "ScriptAI — Premium AI Article & Content Generator",
    description: "Generate publication-ready, SEO-optimized articles in seconds with state-of-the-art AI workflows.",
    siteName: "ScriptAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScriptAI — Premium AI Article & Content Generator",
    description: "Generate publication-ready, SEO-optimized articles in seconds with state-of-the-art AI workflows.",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
