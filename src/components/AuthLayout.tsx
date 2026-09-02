import Sidebar from "./Sidebar";
import { getUser } from "@/lib/auth";

interface AuthLayoutProps {
  children: React.ReactNode;
  userId: number;
}

export default async function AuthLayout({ children, userId }: AuthLayoutProps) {
  const user = await getUser(userId);

  if (!user) {
    return <div className="flex items-center justify-center h-screen">User not found</div>;
  }

  return (
    <Sidebar
      user={{
        id: Number(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    >
      {children}
    </Sidebar>
  );
}
