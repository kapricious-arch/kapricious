import type { Metadata, Viewport } from "next";
import AppShell from "@/components/AppShell";
import { getBaseMetadata } from "@/lib/seo";
import "../src/index.css";

export const metadata: Metadata = getBaseMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
};

export default RootLayout;
