import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "700"], // Specify the weights you need
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable}`}
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #01091b 20%, #021F26 100%)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
