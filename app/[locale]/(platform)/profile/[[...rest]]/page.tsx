import ProfileForm from "@/components/platform/profile/profile-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return <ProfileForm />;
}
