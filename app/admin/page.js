import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionValue } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Administrace — Máminy Makronky",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isLoggedIn = verifySessionValue(cookieStore.get(COOKIE_NAME)?.value);

  return isLoggedIn ? <AdminDashboard /> : <AdminLogin />;
}
