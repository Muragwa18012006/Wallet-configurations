import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pi App - Pi Network Integration",
  description: "A web application integrated with Pi Network",
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
      </head>
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
