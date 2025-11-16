import { useAppContext } from "@/context/app";
import { useState } from "react";

/**
 * Custom hook for refreshing billing data
 * Provides loading state and error handling
 */
export const useBillingRefresh = () => {
  const { refreshBillingData } = useAppContext();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      await refreshBillingData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh billing data"
      );
      console.error("Error refreshing billing data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    refresh,
    isRefreshing,
    error,
  };
};
