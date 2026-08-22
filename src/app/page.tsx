import { DashboardView } from "@/components/DashboardView";
import { AuthGuard } from "@/components/AuthGuard";

export default function Home() {
  return (
    <AuthGuard>
      <DashboardView />
    </AuthGuard>
  );
}
