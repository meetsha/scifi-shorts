import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SciFi Short Story Collection",
  description:
    "An independent index of Hugo and Nebula award-winning short fiction through 2025.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
