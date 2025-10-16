import type { Metadata } from "next";
import { Afacad } from "next/font/google";
import "./globals.css";

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-afacad",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zeynix - Wear The Luxury",
  description: "Your fashion destination for trendy clothing and accessories. Shop the latest trends in men's, women's, and kids' fashion.",
  keywords: "zeynix, top, top brand in india, top brand of clothing, top brand of clothing in india, top brand in India, zeynix clothing, fashion, clothing, men's fashion, women's fashion, kids fashion, online shopping",
  icons: {
    icon: [
      {
        url: '/images/logos/logo.jpg',
        sizes: '32x32',
        type: 'image/jpeg',
      },
      {
        url: '/images/logos/logo.jpg',
        sizes: '16x16',
        type: 'image/jpeg',
      },
    ],
    apple: [
      {
        url: '/images/logos/logo.jpg',
        sizes: '180x180',
        type: 'image/jpeg',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={afacad.variable}>
      <body className={`${afacad.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
