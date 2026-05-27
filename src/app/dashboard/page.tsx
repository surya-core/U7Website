import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;

  if (role === "SUPER_ADMIN") {
    redirect("/dashboard/super-admin");
  } else if (role === "ADMIN") {
    redirect("/dashboard/admin");
  } else {
    redirect("/dashboard/user");
  }
}
