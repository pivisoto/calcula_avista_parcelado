import "./globals.css";

export const metadata = {
  title: "Comparador à vista vs parcelado",
  description: "Simulador financeiro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}