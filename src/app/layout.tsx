"use client";
import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { store } from "@/lib/store";
import { Provider as ReduxProvider } from "react-redux";
const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Salona App",
//   description: "Salona application with React, Tailwind, and Ant Design",
//     generator: 'v0.dev'
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider store={store}>
          <Header />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
