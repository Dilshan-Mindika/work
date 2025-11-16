// Import the createNavigation function from next-intl/navigation
import { createNavigation } from "next-intl/navigation";

// Import the routing configuration
import { routing } from "@/i18n/routing";

// Create navigation helpers using the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
