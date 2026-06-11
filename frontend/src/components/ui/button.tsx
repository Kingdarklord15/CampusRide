import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-none text-xs font-mono font-semibold tracking-widest uppercase transition-colors duration-100 focus-ring disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      default: "bg-black text-white border-2 border-black hover:bg-white hover:text-black",
      secondary: "bg-zinc-100 text-black border-2 border-zinc-100 hover:bg-black hover:text-white hover:border-black",
      outline: "border-2 border-black bg-transparent text-black hover:bg-black hover:text-white",
      ghost: "bg-transparent text-black hover:underline hover:bg-zinc-100",
      danger: "bg-white text-black border-2 border-black hover:bg-black hover:text-white line-through hover:no-underline"
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
