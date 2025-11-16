"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Loader2, Star } from "lucide-react";
import { useTheme } from "next-themes"; // Import theme hook
import { toast } from "sonner";
import { useAppContext } from "@/context/app";

export const FeedbackDialog = () => {
  const { user, myFeedback } = useAppContext();

  const { theme } = useTheme(); // Detect current theme
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  //
  const hanlderOpen = (open: boolean) => {
    if (!open) {
      const nextShowDate = new Date();
      nextShowDate.setDate(nextShowDate.getDate() + 3);
      localStorage.setItem("feedbackShoDate", nextShowDate.toISOString());
    }
  };
  const handleLater = () => {
    const nextShowDate = new Date();
    nextShowDate.setDate(nextShowDate.getDate() + 7);
    localStorage.setItem("feedbackShowDate", nextShowDate.toISOString());
    hanlderOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    const res = await fetch(`/api/app/feedback`, {
      method: "POST",
      body: JSON.stringify({
        rate: rating,
        feedback,
      }),
    });

    if (!res.ok) {
      toast.error("Something Wrong!");
      return;
    }

    toast.success("Thank you for feedback!");
    hanlderOpen(false);
    setLoading(false);
  };

  // Show Feedback Dialog
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  useEffect(() => {
    if (!user || !user.createdAt) return; // Ensure user data is available

    // if (myFeedback?.submited) return;

    const createdAt = new Date(user.createdAt);
    const now = new Date();
    const threeDaysAfterCreation = new Date(createdAt);
    threeDaysAfterCreation.setDate(createdAt.getDate() + 3);

    // Check if feedback was previously dismissed
    const lastDismissed = localStorage.getItem("feedbackShowDate");

    if (lastDismissed) {
      const nextShowDate = new Date(lastDismissed);
      if (now < nextShowDate) return; // Don't show if within cooldown period
    }

    // Show feedback dialog only if 3 days have passed since account creation
    if (now >= threeDaysAfterCreation) {
      setShowFeedbackDialog(true);
    }
  }, [user]); // Runs when `user` data is available

  return (
    <Dialog
      open={showFeedbackDialog}
      onOpenChange={(open) => {
        setShowFeedbackDialog(open);
        if (!open) {
          const nextShowDate = new Date();
          nextShowDate.setDate(nextShowDate.getDate() + 3);
          localStorage.setItem("feedbackShowDate", nextShowDate.toISOString());
        }
      }}
    >
      <DialogContent className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-lg">
        <DialogHeader>
          <p className="text-xl font-bold text-center text-gray-900 dark:text-gray-100">
            Give us your feedback! 🙌
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Your feedback helps us improve. How would you rate your experience?
          </p>
        </DialogHeader>

        {/* Star Rating System */}
        <div className="flex justify-center space-x-2 my-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer transition-all ${
                (hover || rating) >= star
                  ? theme === "dark"
                    ? "fill-yellow-400 scale-110"
                    : "fill-yellow-400  scale-110"
                  : "text-gray-300 dark:text-gray-600"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
        </div>

        {/* Text Input */}
        <textarea
          className="w-full p-2 border rounded-lg text-sm bg-gray-100 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tell us more about your experience..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
        ></textarea>

        <DialogFooter className="flex justify-between mt-4">
          <Button variant="ghost" onClick={handleLater}>
            Maybe later
          </Button>
          <Button disabled={loading} onClick={handleSubmit}>
            {loading && <Loader2 className=" animate-spin" />}
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// {showFeedbackDialog && (
//   <FeedbackDialog
//     open={showFeedbackDialog}
//     setOpen={(open) => {
//       setShowFeedbackDialog(open);
//       if (!open) {
//         const nextShowDate = new Date();
//         nextShowDate.setDate(nextShowDate.getDate() + 7); // Delay next prompt by 7 days
//         localStorage.setItem(
//           "feedbackShowDate",
//           nextShowDate.toISOString()
//         );
//       }
//     }}
//   />
// )}
