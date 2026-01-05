import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted hover:border-secondary/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90",
        ghost: 
          "text-foreground hover:bg-muted hover:text-foreground",
        link: 
          "text-secondary underline-offset-4 hover:underline",
        // Premium restaurant variants
        hero: 
          "bg-gradient-to-r from-secondary to-accent text-secondary-foreground font-semibold shadow-lg hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] px-8",
        heroOutline:
          "border-2 border-secondary/70 text-cream bg-transparent hover:bg-secondary/10 hover:border-secondary font-semibold px-8",
        gold:
          "bg-gradient-to-r from-secondary to-accent text-secondary-foreground font-medium shadow-md hover:shadow-glow active:scale-[0.98]",
        glass:
          "bg-card/60 backdrop-blur-lg border border-border/50 text-foreground hover:bg-card/80 hover:border-secondary/30",
        premium:
          "relative overflow-hidden bg-primary text-primary-foreground font-medium before:absolute before:inset-0 before:bg-gradient-to-r before:from-secondary/20 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
