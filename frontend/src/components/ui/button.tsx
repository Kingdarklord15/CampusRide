import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-md text-xs font-mono font-semibold tracking-widest uppercase transition-all duration-300 focus-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95", {
  variants: {
    variant: {
      default: "bg-white text-black hover:scale-[1.02] hover:bg-white/90 shadow-md shadow-white/5",
      secondary: "bg-white/5 text-white border border-white/8 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]",
      outline: "border border-white/10 bg-transparent text-white hover:bg-white/5 hover:border-white/20 hover:scale-[1.02]",
      ghost: "bg-transparent text-white hover:bg-white/5 hover:text-white",
      danger: "bg-rose-950/20 text-rose-200 border border-rose-500/20 hover:bg-rose-950/40 hover:border-rose-500/40 hover:scale-[1.02]"
    },
    size: { default: "h-11 px-6", sm: "h-9 px-4", lg: "h-12 px-8 text-sm", icon: "h-11 w-11" }
  },
  defaultVariants: { variant: "default", size: "default" }
});

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";
