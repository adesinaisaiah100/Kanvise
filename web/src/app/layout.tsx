import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@livekit/components-styles";
import "@excalidraw/excalidraw/index.css";
import "./globals.css";
import { Toaster } from "sonner";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kanvise Live Classes",
  description: "Live interactive classrooms powered by LiveKit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakartaSans.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
