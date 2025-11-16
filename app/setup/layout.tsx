import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Setup",
  description: "Configure your environment variables to get started",
};

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-sans">
      {children}
    </div>
  );
}
