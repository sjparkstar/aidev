import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redmine 관리 서비스",
  description: "RemoteCall UI 기반 Redmine 연동 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}