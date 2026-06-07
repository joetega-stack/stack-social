import { Google_Sans_Flex,Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AppcontextProvider from "@/context/globalContext";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const googleSans = Google_Sans_Flex({
  variable: "--font-google-sans",
  subsets: ["latin"],
  adjustFontFallback: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={cn("font-sans", inter.variable, jetbrainsMono.variable)}
    >
      <body className={`${googleSans.variable} min-h-full flex flex-col font-sans bg-zinc-50`}>
        <AppcontextProvider>{children}</AppcontextProvider>
      </body>
    </html>
  );
}
