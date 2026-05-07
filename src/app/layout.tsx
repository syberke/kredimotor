import "./globals.css";

export const metadata = {
  title: "Kredit Motor",
  description: "Aplikasi Kredit Motor Online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-100 text-slate-800">{children}</body>
    </html>
  );
}