import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            classNames: {
              success: "bg-emerald-500 text-white",
              error: "bg-red-500 text-white",
              info: "bg-blue-500 text-white",
            },
          }}
        />
      </body>
    </html>
  );
}