import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "",
    joinDate: "2 hours ago",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "",
    joinDate: "5 hours ago",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    avatar: "",
    joinDate: "1 day ago",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    avatar: "",
    joinDate: "2 days ago",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    avatar: "",
    joinDate: "3 days ago",
  },
];

export function RecentUsers() {
  return (
    <div className="space-y-8">
      {mockUsers.map((user) => (
        <div key={user.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="ml-auto font-medium text-sm text-muted-foreground">
            {user.joinDate}
          </div>
        </div>
      ))}
    </div>
  );
}