import type { Metadata } from "next";
import "./globals.css";
import { ReadingProvider } from "@/context/ReadingContext"; // Nuevo

export const metadata: Metadata = {
  title: "Control de Lectura Bíblica",
  description: "Seguimiento de lectura Reina Valera",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen text-white relative bg-[#110b06]">
        <div className="fixed inset-0 bg-cover bg-center -z-20 sepia opacity-40 blur-[1px]" style={{ backgroundImage: "url('/bg-study.jpg')" }}></div>
        <div className="fixed inset-0 bg-[#110b06]/60 -z-10"></div>
        
        {/* Conectamos el cerebro aquí */}
        <ReadingProvider>
          {children}
        </ReadingProvider>

      </body>
    </html>
  );
}