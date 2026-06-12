import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://eat76.vercel.app";

export const metadata: Metadata = {
  title: "Eat76 — Freedom from big delivery",
  description:
    "Local-first food delivery for 19348. Independent restaurants, local drivers, transparent fees.",
  metadataBase: new URL(appUrl),
  manifest: "/manifest.json",
  openGraph: {
    title: "Eat76 — Order local near 19348",
    description:
      "75+ local restaurants. $1.76 service + $4.76 delivery. Save vs big delivery apps.",
    url: appUrl,
    siteName: "Eat76",
    locale: "en_US",
    type: "website",
    images: [{ url: "/logo.svg", width: 512, height: 512, alt: "Eat76" }],
  },
  twitter: {
    card: "summary",
    title: "Eat76 — Local food delivery",
    description: "Order local in Kennett Square. Transparent fees, local drivers.",
    images: ["/logo.svg"],
  },
  appleWebApp: {
    capable: true,
    title: "Eat76",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e4fd6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
