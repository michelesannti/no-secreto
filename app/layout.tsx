import "./globals.css";

import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "No Secreto",
  description: "Seu diário espiritual no secreto com Deus.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body
        className={`${playfair.variable} ${inter.variable} ${cormorant.variable} antialiased`}
        style={{
          backgroundColor: "#F9F5E9",
          color: "#70412D",
          fontFamily: "var(--font-inter)",
        }}
      >
        {children}
      </body>
    </html>
  );
}