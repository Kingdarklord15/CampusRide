import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function RatingCard({ score, comment }: { score: number; comment?: string }) {
  return <Card><CardContent className="p-5"><p className="flex gap-1">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-4 w-4 ${index < score ? "fill-amber-400 text-amber-400" : "text-zinc-300"}`} />)}</p>{comment ? <p className="mt-3 text-sm text-zinc-600">{comment}</p> : null}</CardContent></Card>;
}
