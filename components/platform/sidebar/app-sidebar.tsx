import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import SidebarButton from "@/components/platform/sidebar/sidebar-button";
import {
  ChartAreaIcon,
  CreditCard,
  FileChartLineIcon,
  FilePlus2Icon,
  FileTextIcon,
  MailCheck,
  MessageCircleIcon,
  PaperclipIcon,
  User,
} from "lucide-react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

// setup
const showRecentlyClicked = false;

export function AppSidebar() {
  const [recentlyClicked, setRecentlyClicked] = useState<string[]>([]);

  useEffect(() => {
    // Only retrieve clicked paths if showRecentlyClicked is true
    if (showRecentlyClicked) {
      const storedPaths = JSON.parse(
        Cookies.get("clickedPaths") || "[]"
      ) as string[];
      setRecentlyClicked(storedPaths);
    }
  }, []);

  const handleSidebarButtonClick = (path: string) => {
    // Only track recent clicks if showRecentlyClicked is true
    if (!showRecentlyClicked) return;

    // Retrieve the current cookies and parse them
    const currentPaths = JSON.parse(
      Cookies.get("clickedPaths") || "[]"
    ) as string[];

    // Remove the clicked path if it already exists to avoid duplicates
    const filteredPaths = currentPaths.filter((p) => p !== path);

    // Add the new path to the front of the array
    filteredPaths.unshift(path);

    // Keep only the last three clicked paths
    if (filteredPaths.length > 3) {
      filteredPaths.splice(3); // Remove paths beyond the third
    }

    // Save the updated paths back to the cookies
    Cookies.set("clickedPaths", JSON.stringify(filteredPaths));
    setRecentlyClicked(filteredPaths); // Update state to re-render recently clicked buttons
  };

  // Filter out the recently clicked items from sidebarItems only if showRecentlyClicked is true
  const filteredSidebarItems = showRecentlyClicked
    ? sidebarItems.filter((item) => !recentlyClicked.includes(item.path))
    : sidebarItems;

  return (
    <Sidebar className="bg-background">
      <SidebarHeader className="bg-background">
        <div className="py-2 px-2">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        {/* Recently Clicked Section - only show if showRecentlyClicked is true */}
        {showRecentlyClicked && recentlyClicked.length > 0 && (
          <SidebarGroup className="space-y-1 sticky top-0 z-50 bg-background  ">
            <p className="text-xs pb-1 text-muted-foreground">Recently</p>
            {recentlyClicked.map((path, idx) => {
              const item = sidebarItems.find((item) => item.path === path);
              return item ? (
                <SidebarButton
                  key={idx}
                  path={item.path}
                  onClick={() => handleSidebarButtonClick(item.path)} // Pass the click handler
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarButton>
              ) : null;
            })}
          </SidebarGroup>
        )}
        {/* Main Navigation Section */}
        <SidebarGroup className="space-y-1">
          <p className="text-xs pb-1 text-muted-foreground">Navigation</p>
          {filteredSidebarItems.map((data, idx) => (
            <SidebarButton
              key={idx}
              path={data.path}
              onClick={() => handleSidebarButtonClick(data.path)} // Pass the click handler
            >
              {data.icon}
              <span>{data.label}</span>
            </SidebarButton>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

const sidebarItems = [
  {
    label: "Dashboard",
    icon: <ChartAreaIcon className="w-4 h-4" />,
    path: "/app",
  },
  {
    label: "Invoice",
    icon: <FileTextIcon className="w-4 h-4" />,
    path: "/app/item-1",
  },
  {
    label: "Customers",
    icon: <User className="w-4 h-4" />,
    path: "/app/customers",
  },
  {
    label: "Emails",
    icon: <MailCheck className="w-4 h-4" />,
    path: "/app/emails",
  },
  {
    label: "Paymnets",
    icon: <CreditCard className="w-4 h-4" />,
    path: "/app/emails",
  },
];
