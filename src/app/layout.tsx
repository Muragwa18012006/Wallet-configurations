import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Pi App - Pi Network Integration",
  description: "A web application integrated with Pi Network",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://sdk.minepi.com/pi-sdk.js" async></script>
        <Image src="/logo.jpg" alt="Pi Logo" width={32} height={32} />
      </head>
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
