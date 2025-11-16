"use client";
import { SignIn, useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { Link } from "@/i18n/navigation";
import { Skeleton } from "../ui/skeleton";

export default function SignInForm() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const { isLoaded } = useAuth();
  return (
    <>
      {isLoaded ? (
        <div>
          <SignIn
            appearance={{
              elements: {
                cardBox: {
                  boxShadow: "none",
                },

                formContainer: {},
                footer: {
                  display: "none",
                },
              },
              baseTheme: currentTheme === "dark" ? dark : undefined,
            }}
          />
          <p className="text-[14px] text-center">
            Don{"'"}t have an account?{" "}
            <Link className="hover:underline" href="/sign-up">
              Sign up
            </Link>
          </p>
        </div>
      ) : (
        <div>
          <Skeleton className=" w-[350px] h-[400px]" />
        </div>
      )}
    </>
  );
}
