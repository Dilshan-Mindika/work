import * as React from "react";

// Define the breakpoint for mobile devices
const MOBILE_BREAKPOINT = 768;

// Custom hook to determine if the current viewport is mobile-sized
export function useIsMobile() {
  // State to store whether the viewport is mobile-sized
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    // Create a MediaQueryList object
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Function to update the state based on the viewport width
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Add event listener for changes in the viewport width
    mql.addEventListener("change", onChange);

    // Set the initial state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Cleanup event listener on component unmount
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Return the state, ensuring it is a boolean
  return !!isMobile;
}
