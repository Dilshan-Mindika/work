import SignUpForm from "@/components/auth/sign-up-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SingUp",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
