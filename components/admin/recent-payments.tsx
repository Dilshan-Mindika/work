import { Badge } from "@/components/ui/badge";

const mockPayments = [
  {
    id: "1",
    user: "John Doe",
    amount: "$29.99",
    plan: "Coffee Plan",
    status: "completed",
    date: "2 hours ago",
  },
  {
    id: "2",
    user: "Jane Smith",
    amount: "$99.99",
    plan: "Lifetime Deal",
    status: "completed",
    date: "5 hours ago",
  },
  {
    id: "3",
    user: "Bob Johnson",
    amount: "$29.99",
    plan: "Coffee Plan",
    status: "pending",
    date: "1 day ago",
  },
  {
    id: "4",
    user: "Alice Brown",
    amount: "$99.99",
    plan: "Lifetime Deal",
    status: "completed",
    date: "2 days ago",
  },
  {
    id: "5",
    user: "Charlie Wilson",
    amount: "$29.99",
    plan: "Coffee Plan",
    status: "failed",
    date: "3 days ago",
  },
];

export function RecentPayments() {
  return (
    <div className="space-y-4">
      {mockPayments.map((payment) => (
        <div key={payment.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{payment.user}</p>
            <p className="text-sm text-muted-foreground">{payment.plan}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm font-medium">{payment.amount}</p>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  payment.status === "completed"
                    ? "default"
                    : payment.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
                className="text-xs"
              >
                {payment.status}
              </Badge>
              <p className="text-xs text-muted-foreground">{payment.date}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}