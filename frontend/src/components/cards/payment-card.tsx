import { CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Payment } from "@/types";
import { Badge } from "@/components/ui/badge";

export function PaymentCard({ payment }: { payment: Payment }) {
  return <Card><CardContent className="flex items-center justify-between p-5"><div className="flex items-center gap-3"><CreditCard className="h-5 w-5 text-indigo-600" /><div><p className="font-medium">{formatCurrency(payment.amount)}</p><p className="text-sm text-zinc-500">{formatDate(payment.createdAt)}</p></div></div><Badge variant={payment.status === "PAID" ? "success" : "warning"}>{payment.status}</Badge></CardContent></Card>;
}
