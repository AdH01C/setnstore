import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/components/Providers";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { store } from "@/store/store";

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
      <head>
        {/* exaplin: the default referred policy will only send the origin when request to other domain -> need to change this  */}
        <meta name="referrer" content="no-referrer-when-downgrade" />
      </head>
      <body>
        <Providers>
          <AntdRegistry>{children}</AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}
