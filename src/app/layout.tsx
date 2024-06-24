"use client";
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout";
import '@rainbow-me/rainbowkit/styles.css';
import { ProviderDisconnectedError } from "viem";
import { Providers } from "./provider";
import "../includes/i18n"


// const inter = Inter({ subsets: ["latin"]});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}