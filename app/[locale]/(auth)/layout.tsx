// Importing necessary components and modules
import Footer from "@/components/landing/footer/footer-1";
import { Logo } from "@/components/logo";
import Link from "next/link";

// Defining the AuthLayout component
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Header section with logo */}
      <header className="mx-auto max-w-screen-xl py-5 px-5">
        <Link href="/">
          <Logo />
        </Link>
      </header>
      {/* Main content section */}
      <main className="flex min-h-screen justify-center mt-[55px] md:mt-[50px]">
        {children}
      </main>
      {/* Footer section */}
      <Footer />
    </>
  );
}
