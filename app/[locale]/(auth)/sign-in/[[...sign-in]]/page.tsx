import SignInForm from "@/components/auth/sign-in-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignIn",
};

export default function SignInPage() {
  return <SignInForm />;
}
