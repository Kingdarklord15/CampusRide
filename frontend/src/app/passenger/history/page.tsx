"use client";

import { useState } from "react";
import { Star, ShieldAlert, Calendar, MapPin, Smile, MessageSquare } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useRides } from "@/hooks/use-queries";
import { ratingService } from "@/services/rating.service";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/cards/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PassengerHistoryPage() {
  const { data: rides, isLoading, refetch } = useRides();
  const showToast = useUiStore((state) => state.toast);
  
  // Rating Modal state
  const [activeRateRideId, setActiveRateRideId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRateRideId) return;

    setSubmitting(true);
    try {
      await ratingService.submit({
        rideId: activeRateRideId,
        score,
        comment: comment || undefined
      });
      showToast({ title: "Feedback Received", description: "Thank you for rating your driver!", type: "success" });
      setActiveRateRideId(null);
      setComment("");
      setScore(5);
      refetch();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to submit rating";
      showToast({ title: "Rating Failed", description: msg, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell role="PASSENGER">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900">Your Ride History</h1>
          <p className="text-zinc-500">Review all your past bookings and share ratings.</p>
        </div>

        {/* History Table / Cards */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        ) : rides && rides.length > 0 ? (
          <div className="grid gap-4">
            {rides.map((ride) => {
              const hasRated = !!ride.rating;
              return (
                <div key={ride.id} className="p-5 border rounded-2xl bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={ride.status} />
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(ride.requestedAt)}
                      </span>
                    </div>
                    
                    <div className="grid gap-1.5 text-sm text-zinc-700">
                      <p className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-600" />
                        <span className="font-semibold">From:</span> {ride.pickupLocation}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-600" />
                        <span className="font-semibold">To:</span> {ride.dropoffLocation}
                      </p>
                    </div>

                    {ride.driverProfile && (
                      <p className="text-xs text-zinc-500">
                        Driver: <span className="font-semibold text-zinc-700">{ride.driverProfile.user?.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                    <span className="font-bold text-lg text-zinc-900">{formatCurrency(ride.fareAmount)}</span>
                    
                    {ride.status === "COMPLETED" && (
                      hasRated ? (
                        <div className="flex items-center gap-1.5 text-yellow-500">
                          {Array.from({ length: Number(ride.rating?.score || 5) }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-500" />
                          ))}
                          <span className="text-xs text-zinc-500 ml-1">Rated</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setActiveRateRideId(ride.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 py-1 px-3"
                        >
                          <Smile className="h-3.5 w-3.5" /> Rate Driver
                        </Button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-zinc-50/50">
            <ShieldAlert className="h-10 w-10 text-zinc-400 mb-3" />
            <p className="font-semibold text-zinc-700">No ride history</p>
            <p className="text-sm text-zinc-500">You haven't completed any rides yet.</p>
          </div>
        )}

        {/* Rating Modal Dialog */}
        {activeRateRideId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-zinc-100">
              <h3 className="text-xl font-bold text-zinc-950 mb-2">Rate Driver</h3>
              <p className="text-xs text-zinc-500 mb-6">Let us know how your transit experience was.</p>

              <form onSubmit={handleRateSubmit} className="space-y-6">
                {/* Star Rating selector */}
                <div className="space-y-2 text-center">
                  <Label className="text-sm">Rating Score</Label>
                  <div className="flex justify-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setScore(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= score ? "text-yellow-500 fill-yellow-500" : "text-zinc-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Box */}
                <div className="space-y-2">
                  <Label htmlFor="comment">Comments or Suggestions (Optional)</Label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Provide your feedback (e.g. driver arrived on time, comfortable ride...)"
                    className="w-full min-h-[100px] p-3 border rounded-xl focus-ring text-sm resize-none"
                    disabled={submitting}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setActiveRateRideId(null);
                      setScore(5);
                      setComment("");
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Rating"}
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
