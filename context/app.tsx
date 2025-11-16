import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the Billing interface
interface Billing {
  plan: string;
  details: {
    id: string;
    planType: string;
    features: string[];
    popular: boolean;
    billingCycle: string;
    currencySymbol: string;
    link: string;
    name: string;
    price: string;
    priceId: string;
  };
  credits: number;
}

// Define the User interface
interface User {
  createdAt: string;
}

// Define the MyFeedback interface
interface MyFeedback {
  submited: boolean;
  feedback: {
    avatar: string;
    star: number;
    comment: string;
  };
}

// Define the shape of the context data
interface AppContextType {
  billing: Billing | null;
  setBilling: (billing: Billing | null) => void;

  myFeedback: MyFeedback | null;
  setMyFeedback: (myFeedback: MyFeedback | null) => void;

  user: User | null;
  setUser: (user: User | null) => void;

  // Add function to refresh billing data
  refreshBillingData: () => Promise<void>;
}

/**
 * Create the application context
 * 
 * This context will be undefined initially and must be used within AppProvider
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // State to store billing information
  const [billing, setBilling] = useState<Billing | null>(null);

  // State to store feedback information
  const [myFeedback, setMyFeedback] = useState<MyFeedback | null>(null);

  // State to store user information
  const [user, setUser] = useState<User | null>(null);

  // Function to refresh billing data from the server
  const refreshBillingData = async () => {
    try {
      const res = await fetch(`/api/app`, {
        method: "GET",
        cache: "no-store", // Don't use cache to get fresh data
      });

      if (!res.ok) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch billing data");
        }
        return;
      }

      const data = await res.json();
      setBilling(data.billing);
      setUser(data.user);
      setMyFeedback(data.myFeedback);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error refreshing billing data:", error);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        billing,
        setBilling,
        myFeedback,
        setMyFeedback,
        user,
        setUser,
        refreshBillingData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/**
 * Custom hook to access the application context
 * 
 * This hook provides access to global state including billing, user, and feedback data.
 * It also provides methods to update this data and refresh from the server.
 * 
 * @throws Error if used outside of AppProvider
 * @returns The application context with all state and methods
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { billing, refreshBillingData } = useAppContext();
 *   
 *   return (
 *     <div>
 *       <p>Plan: {billing?.details.name}</p>
 *       <button onClick={refreshBillingData}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(
      "useAppContext must be used within an AppProvider. " +
      "Make sure your component is wrapped with <AppProvider>."
    );
  }
  return context;
};
