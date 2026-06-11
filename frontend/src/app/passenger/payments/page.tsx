"use client";

import { useState } from "react";
import { Check, ShieldCheck, DollarSign, Wallet, QrCode, CreditCard, ShieldAlert } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { usePayments, useRides, useRideActions } from "@/hooks/use-queries";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PassengerPaymentsPage() {
  const { data: payments, isLoading: loadingPayments, refetch: refetchPayments } = usePayments();
  const { data: rides, refetch: refetchRides } = useRides();
  const { createPayment } = useRideActions();
  const showToast = useUiStore((state) => state.toast);

  // Unpaid completed rides
  const unpaidRides = rides?.filter((r) => r.status === "COMPLETED" && (!r.payment || r.payment.status === "PENDING")) || [];

  // Pay Modal State
  const [activePayRide, setActivePayRide] = useState<any | null>(null);
  const [payMethod, setPayMethod] = useState<"MOCK_UPI" | "CASH" | "WALLET">("MOCK_UPI");
  const [upiId, setUpiId] = useState("student@upi");
  const [paying, setPaying] = useState(false);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePayRide) return;

    setPaying(true);
    try {
      await createPayment.mutateAsync({
        rideId: activePayRide.id,
        amount: Number(activePayRide.fareAmount),
        method: payMethod,
      });

      showToast({
        title: "Payment Successful",
        description: `Paid ₹${activePayRide.fareAmount} via ${payMethod.replace("_", " ")}`,
        type: "success",
      });
      setActivePayRide(null);
      refetchPayments();
      refetchRides();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to make payment";
      showToast({ title: "Payment Failed", description: msg, type: "error" });
    } finally {
      setPaying(false);
    }
  };

  return (
    <DashboardShell role="PASSENGER">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900">Payments & Billing</h1>
          <p className="text-zinc-500">Manage invoices, unpaid completed rides, and payment history.</p>
        </div>

        {/* Unpaid Rides Section */}
        {unpaidRides.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-rose-900">Unpaid Completed Rides</h2>
            <div className="grid gap-4">
              {unpaidRides.map((ride) => (
                <div key={ride.id} className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-rose-950">Trip Completed: {ride.pickupLocation} ➔ {ride.dropoffLocation}</p>
                    <p className="text-xs text-rose-700">Completed on: {formatDate(ride.requestedAt)}</p>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <span className="font-bold text-rose-950">₹{ride.fareAmount}</span>
                    <Button
                      onClick={() => setActivePayRide(ride)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 text-xs"
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Transaction History</h2>
          {loadingPayments ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          ) : payments && payments.length > 0 ? (
            <div className="overflow-x-auto border border-zinc-100 rounded-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-zinc-500 font-semibold border-b border-zinc-100">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50/50">
                      <td className="p-4 text-zinc-500">{formatDate(p.createdAt)}</td>
                      <td className="p-4 font-mono text-zinc-700">{p.id.slice(0, 8)}...</td>
                      <td className="p-4 font-semibold text-zinc-850">{p.method.replace("_", " ")}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          p.status === "PAID" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                        }`}>
                          {p.status === "PAID" ? <Check className="h-3 w-3" /> : null}
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold">{formatCurrency(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-zinc-50/50">
              <ShieldAlert className="h-10 w-10 text-zinc-400 mb-3" />
              <p className="font-semibold text-zinc-700">No transactions yet</p>
              <p className="text-sm text-zinc-500">Your completed rides billing history will appear here.</p>
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {activePayRide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border shadow-2xl space-y-6">
              <div>
                <h3 className="text-xl font-bold text-zinc-950">Complete Trip Payment</h3>
                <p className="text-xs text-zinc-500 mt-1">Amount Due: <span className="font-bold text-indigo-600">₹{activePayRide.fareAmount}</span></p>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {/* Method selector tabs */}
                <div className="grid grid-cols-3 gap-2 bg-zinc-50 p-1 border rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPayMethod("MOCK_UPI")}
                    className={`py-3 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                      payMethod === "MOCK_UPI" ? "bg-white text-indigo-600 shadow-sm border border-zinc-100" : "text-zinc-500"
                    }`}
                  >
                    <QrCode className="h-4 w-4" /> Mock UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod("WALLET")}
                    className={`py-3 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                      payMethod === "WALLET" ? "bg-white text-indigo-600 shadow-sm border border-zinc-100" : "text-zinc-500"
                    }`}
                  >
                    <Wallet className="h-4 w-4" /> Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod("CASH")}
                    className={`py-3 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                      payMethod === "CASH" ? "bg-white text-indigo-600 shadow-sm border border-zinc-100" : "text-zinc-500"
                    }`}
                  >
                    <DollarSign className="h-4 w-4" /> Cash
                  </button>
                </div>

                {payMethod === "MOCK_UPI" && (
                  <div className="p-4 border rounded-xl bg-zinc-50 flex flex-col items-center gap-4 animate-fade-in">
                    <div className="bg-white p-3 border rounded-xl shadow-inner">
                      {/* CSS Mock QR Code */}
                      <div className="h-28 w-28 bg-zinc-950 rounded-lg flex flex-wrap items-center justify-center p-1">
                        <div className="h-full w-full bg-white grid grid-cols-4 grid-rows-4 gap-1 p-1">
                          <div className="bg-zinc-950 border border-white"></div>
                          <div className="bg-zinc-950 border border-white"></div>
                          <div className="bg-white border border-white"></div>
                          <div className="bg-zinc-950 border border-white"></div>
                          <div className="bg-zinc-950 border border-white"></div>
                          <div className="bg-white border border-white"></div>
                          <div className="bg-zinc-950 border border-white"></div>
                          <div className="bg-white border border-white"></div>
                          <div className="bg-white border border-white"></div>
                          <div className="bg-zinc-950 border border-white"></div>
                          <div className="bg-white border border-white"></div>
                          <div className="bg-zinc-950 border border-white"></div>
                          <div className="bg-zinc-950 border border-white"></div>
                          <div className="bg-white border border-white"></div>
                          <div className="bg-zinc-950 border border-white"></div>
                          <div className="bg-zinc-950 border border-white"></div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1 w-full">
                      <Label htmlFor="upi-id">UPI ID / Address</Label>
                      <Input
                        id="upi-id"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="student@upi"
                        required
                      />
                    </div>
                  </div>
                )}

                {payMethod === "WALLET" && (
                  <div className="p-4 border rounded-xl bg-indigo-50 border-indigo-100 flex items-center gap-3 text-indigo-900 text-sm">
                    <Wallet className="h-5 w-5 text-indigo-600 shrink-0" />
                    <p>Pay instantly using your pre-loaded CampusRide wallet balance.</p>
                  </div>
                )}

                {payMethod === "CASH" && (
                  <div className="p-4 border rounded-xl bg-yellow-50 border-yellow-100 flex items-center gap-3 text-yellow-900 text-sm">
                    <DollarSign className="h-5 w-5 text-yellow-600 shrink-0" />
                    <p>Pay cash directly to the driver upon complete inspection and departure.</p>
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActivePayRide(null)}
                    disabled={paying}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                    disabled={paying}
                  >
                    <ShieldCheck className="h-4 w-4" /> {paying ? "Processing..." : "Complete Payment"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
