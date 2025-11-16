"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export default function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Define segments to ignore, including the dynamic locale segment
  const ignoredSegments = ["", "home", "app"];
  const pathSegments = pathname
    .split("/")
    .filter(
      (segment) => !ignoredSegments.includes(segment) && segment !== "en"
    ); // Ignore the locale dynamically

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;
          const formattedText = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <div key={href} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-xl">
                    {formattedText}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink className="text-xl" href={`/app${href}`}>
                    {formattedText}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
