import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnimeV - Лучшая платформа для просмотра аниме",
  description: "Смотрите любимые аниме онлайн в высоком качестве с русскими субтитрами. Огромная коллекция аниме сериалов и фильмов.",
  keywords: "аниме, anime, онлайн, смотреть, субтитры, русские, сериалы, фильмы",
  authors: [{ name: "AnimeV Team" }],
  creator: "AnimeV",
  publisher: "AnimeV",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
