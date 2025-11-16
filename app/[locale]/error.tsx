"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  // Get a user-friendly error message
  const getErrorMessage = (error: Error) => {
    if (error.message.includes("Failed to fetch")) {
      return "Network error: Please check your internet connection";
    }
    if (error.message.includes("404")) {
      return "The requested resource was not found";
    }
    if (error.message.includes("401") || error.message.includes("403")) {
      return "You don't have permission to access this resource";
    }
    return error.message || "An unexpected error occurred";
  };

  return (
    <div className="flex py-6 md:py-10 min-h-screen justify-center items-center bg-background px-4 md:px-6">
      <div className="flex flex-col space-y-4 md:space-y-6 justify-center items-center max-w-2xl w-full">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <span className="text-xl md:text-2xl">⚠️</span>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Oops! Something went wrong
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            {getErrorMessage(error)}
          </p>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm font-medium">
                Technical Details
              </span>
              <span className="text-xs text-muted-foreground">
                {error.digest}
              </span>
            </div>
            <pre className="bg-muted w-full overflow-auto rounded-lg p-2 md:p-4 text-xs md:text-sm">
              <code className="text-foreground">
                {JSON.stringify(
                  {
                    name: error.name,
                    message: error.message,
                    stack: error.stack?.split("\n"),
                  },
                  null,
                  2
                )}
              </code>
            </pre>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => reset()}
            className="gap-2 w-full sm:w-auto"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button className="gap-2 w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
