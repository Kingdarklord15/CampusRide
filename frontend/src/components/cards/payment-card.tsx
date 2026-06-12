import { CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Payment } from "@/types";
import { Badge } from "@/components/ui/badge";

export function PaymentCard({ payment }: { payment: Payment }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-white" />
          <div>
            <p className="text-sm font-extrabold text-white">{formatCurrency(payment.amount)}</p>
            <p className="text-[10px] font-mono text-zinc-500 mt-1">{formatDate(payment.createdAt)}</p>
          </div>
        </div>
        <Badge variant={payment.status === "PAID" ? "success" : "warning"}>{payment.status}</Badge>
      </CardContent>
    </Card>
  );
}
