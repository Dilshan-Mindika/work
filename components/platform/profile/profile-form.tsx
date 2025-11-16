"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { Suspense } from "react";

export default function ProfileForm() {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex mx-auto flex-col items-center w-full max-w-6xl px-4 py-8">
        <div className="w-full">
          <Suspense
            fallback={
              <div className="w-full">
                <Skeleton className="w-full h-[650px] rounded-xl" />
              </div>
            }
          >
            <div className="bg-card rounded-xl shadow-sm overflow-hidden">
              <UserProfile
                appearance={{
                  elements: {
                    rootBox: {
                      width: "100%",
                    },
                    cardBox: {
                      width: "100%",
                      boxShadow: "none",
                      borderRadius: "0px",
                      backgroundColor: "transparent",
                      border: "none",
                    },
                    scrollBox: {
                      borderRadius: "0px",
                      backgroundColor: "transparent",
                    },
                    footerItem: {
                      display: "none",
                    },
                    navbar: {
                      borderRadius: "0px",
                      backgroundColor: "var(--card)",
                      borderBottom: "2px solid var(--border)",
                      padding: "1rem",
                    },
                    nav: {
                      backgroundColor: "var(--card)",
                      gap: "0.5rem",
                    },
                    navButton: {
                      color: "var(--foreground)",
                      fontWeight: "500",
                      backgroundColor: "transparent",
                      border: "1px solid transparent",
                      borderRadius: "var(--radius)",
                      padding: "0.5rem 1rem",
                      "&:hover": {
                        backgroundColor: "var(--muted)",
                        color: "var(--foreground)",
                        borderColor: "var(--border)",
                      },
                      "&[data-active='true']": {
                        backgroundColor: "var(--primary)",
                        color: "var(--primary-foreground)",
                        fontWeight: "600",
                        borderColor: "var(--primary)",
                      },
                    },
                    pageScrollBox: {
                      backgroundColor: "var(--card)",
                      padding: "1.5rem",
                    },
                    formButtonPrimary: {
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                      fontWeight: "500",
                      border: "1px solid var(--primary)",
                      borderRadius: "var(--radius)",
                      "&:hover": {
                        backgroundColor: "var(--primary)/90",
                        borderColor: "var(--primary)/90",
                      },
                      "&:focus": {
                        boxShadow: "0 0 0 2px var(--primary)/20",
                      },
                    },
                    formButtonSecondary: {
                      backgroundColor: "var(--muted)",
                      color: "var(--foreground)",
                      fontWeight: "500",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      "&:hover": {
                        backgroundColor: "var(--muted)/80",
                        borderColor: "var(--border)",
                      },
                    },
                    formFieldInput: {
                      backgroundColor: "var(--background)",
                      border: "2px solid var(--border)",
                      color: "var(--foreground)",
                      borderRadius: "var(--radius)",
                      padding: "0.75rem",
                      fontSize: "0.875rem",
                      "&:focus": {
                        borderColor: "var(--primary)",
                        boxShadow: "0 0 0 2px var(--primary)/20",
                        backgroundColor: "var(--background)",
                      },
                      "&:hover": {
                        borderColor: "var(--border)",
                        backgroundColor: "var(--background)",
                      },
                      "&::placeholder": {
                        color: "var(--muted-foreground)",
                        opacity: "0.7",
                      },
                    },
                    formFieldLabel: {
                      color: "var(--foreground)",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                      marginBottom: "0.5rem",
                    },
                    formFieldLabelRow: {
                      color: "var(--foreground)",
                    },
                    formFieldHintText: {
                      color: "var(--muted-foreground)",
                      fontSize: "0.75rem",
                      marginTop: "0.25rem",
                    },
                    formFieldErrorText: {
                      color: "var(--destructive)",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      marginTop: "0.25rem",
                    },
                    dividerLine: {
                      backgroundColor: "var(--border)",
                      height: "1px",
                    },
                    dividerText: {
                      color: "var(--muted-foreground)",
                      fontWeight: "500",
                      fontSize: "0.875rem",
                    },
                    headerTitle: {
                      color: "var(--foreground)",
                      fontWeight: "700",
                      fontSize: "1.75rem",
                      marginBottom: "0.5rem",
                    },
                    headerSubtitle: {
                      color: "var(--muted-foreground)",
                      fontSize: "1rem",
                      lineHeight: "1.5",
                    },
                    profileSectionTitle: {
                      color: "var(--foreground)",
                      fontWeight: "600",
                      fontSize: "1.25rem",
                      marginBottom: "0.5rem",
                    },
                    profileSectionSubtitle: {
                      color: "var(--muted-foreground)",
                      fontSize: "0.875rem",
                      lineHeight: "1.5",
                    },
                    userPreviewMainIdentifier: {
                      color: "var(--foreground)",
                      fontWeight: "600",
                      fontSize: "1rem",
                    },
                    userPreviewSecondaryIdentifier: {
                      color: "var(--muted-foreground)",
                      fontSize: "0.875rem",
                    },
                    avatarBox: {
                      backgroundColor: "var(--muted)",
                      border: "3px solid var(--border)",
                      borderRadius: "50%",
                    },
                    badge: {
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                      fontWeight: "500",
                      fontSize: "0.75rem",
                      borderRadius: "var(--radius)",
                    },
                    alert: {
                      backgroundColor: "var(--muted)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      padding: "1rem",
                    },
                    alertText: {
                      color: "var(--foreground)",
                      fontWeight: "500",
                      fontSize: "0.875rem",
                    },
                    modalBackdrop: {
                      backgroundColor: "var(--background)/80",
                    },
                    modalContent: {
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      boxShadow: "0 10px 25px -5px var(--background)/20",
                    },
                    formFieldRow: {
                      marginBottom: "1.5rem",
                    },
                    formField: {
                      marginBottom: "1.5rem",
                    },
                    formSectionTitle: {
                      color: "var(--foreground)",
                      fontWeight: "600",
                      fontSize: "1.125rem",
                      marginBottom: "1rem",
                      paddingBottom: "0.5rem",
                      borderBottom: "1px solid var(--border)",
                    },
                    formSectionSubtitle: {
                      color: "var(--muted-foreground)",
                      fontSize: "0.875rem",
                      marginBottom: "1.5rem",
                      lineHeight: "1.5",
                    },
                    formFieldAction: {
                      color: "var(--primary)",
                      fontWeight: "500",
                      fontSize: "0.875rem",
                      "&:hover": {
                        color: "var(--primary)/80",
                        textDecoration: "underline",
                      },
                    },
                    formFieldInputShowPasswordButton: {
                      color: "var(--muted-foreground)",
                      backgroundColor: "transparent",
                      border: "none",
                      "&:hover": {
                        color: "var(--foreground)",
                        backgroundColor: "var(--muted)",
                      },
                    },
                    formFieldInputShowPasswordIcon: {
                      color: "var(--muted-foreground)",
                    },
                    formResendCodeLink: {
                      color: "var(--primary)",
                      fontWeight: "500",
                      fontSize: "0.875rem",
                      "&:hover": {
                        color: "var(--primary)/80",
                        textDecoration: "underline",
                      },
                    },
                    formFieldActionLink: {
                      color: "var(--primary)",
                      fontWeight: "500",
                      fontSize: "0.875rem",
                      "&:hover": {
                        color: "var(--primary)/80",
                        textDecoration: "underline",
                      },
                    },
                    formFieldInputSelect: {
                      backgroundColor: "var(--background)",
                      border: "2px solid var(--border)",
                      color: "var(--foreground)",
                      borderRadius: "var(--radius)",
                      padding: "0.75rem",
                      fontSize: "0.875rem",
                      "&:focus": {
                        borderColor: "var(--primary)",
                        boxShadow: "0 0 0 2px var(--primary)/20",
                      },
                      "&:hover": {
                        borderColor: "var(--border)",
                      },
                    },
                    formFieldInputSelectOption: {
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      padding: "0.5rem",
                    },
                    formFieldInputSelectOptionSelected: {
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    },
                    formFieldInputSelectOptionHover: {
                      backgroundColor: "var(--muted)",
                      color: "var(--foreground)",
                    },
                    formFieldInputSelectOptionActive: {
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    },
                    formFieldInputSelectOptionDisabled: {
                      backgroundColor: "var(--muted)",
                      color: "var(--muted-foreground)",
                    },
                    formFieldInputSelectOptionGroup: {
                      backgroundColor: "var(--muted)",
                      color: "var(--muted-foreground)",
                      fontWeight: "600",
                      padding: "0.5rem",
                    },
                    formFieldInputSelectOptionGroupOption: {
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      padding: "0.5rem",
                    },
                    formFieldInputSelectOptionGroupOptionSelected: {
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    },
                    formFieldInputSelectOptionGroupOptionHover: {
                      backgroundColor: "var(--muted)",
                      color: "var(--foreground)",
                    },
                    formFieldInputSelectOptionGroupOptionActive: {
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    },
                    formFieldInputSelectOptionGroupOptionDisabled: {
                      backgroundColor: "var(--muted)",
                      color: "var(--muted-foreground)",
                    },
                  },
                  baseTheme: currentTheme === "dark" ? dark : undefined,
                  variables: {
                    colorPrimary: "var(--primary)",
                    colorBackground: "var(--background)",
                    colorInputBackground: "var(--background)",
                    colorInputText: "var(--foreground)",
                    colorText: "var(--foreground)",
                    colorTextSecondary: "var(--muted-foreground)",
                    colorSuccess: "var(--success)",
                    colorDanger: "var(--destructive)",
                    colorWarning: "var(--warning)",
                    colorNeutral: "var(--muted)",
                    borderRadius: "var(--radius)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "14px",
                    fontWeight: {
                      normal: "400",
                      medium: "500",
                      bold: "700",
                    },
                  },
                }}
              />
            </div>
          </Suspense>
        </div>
      </main>
    </div>
  );
}
