import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-xl shadow-glass transition-all duration-300 hover:scale-[1.02] hover:border-white/20", className)} {...props} />
);
export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("space-y-1 p-6 border-b border-white/5", className)} {...props} />;
export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className={cn("font-display text-lg font-bold tracking-tight text-foreground", className)} {...props} />;
export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p className={cn("font-body text-xs text-muted-foreground", className)} {...props} />;
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("p-6", className)} {...props} />;
