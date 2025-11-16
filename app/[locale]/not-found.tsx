import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 md:px-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary">404</h1>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
            Page Not Found
          </h2>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. The page might
            have been removed, had its name changed, or is temporarily
            unavailable.
          </p>
        </div>

        <div className="mt-8">
          <Link href="/">
            <Button variant="default" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
