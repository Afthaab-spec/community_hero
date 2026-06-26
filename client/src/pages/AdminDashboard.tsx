import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="container py-12">
      <Card className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-[hsl(var(--muted-foreground))]">Loading admin dashboard...</p>
      </Card>
    </div>
  );
}
