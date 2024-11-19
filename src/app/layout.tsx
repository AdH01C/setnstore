import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/components/Providers";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { useRouter } from "next/router";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Set N Store",
  description: "Set N Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="referrer" content="no-referrer-when-downgrade" />
      <body>
        <Providers>
          <AntdRegistry>{children}</AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}
