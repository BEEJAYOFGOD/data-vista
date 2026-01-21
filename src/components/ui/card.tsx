import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
    "text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm",
    {
        variants: {
            variant: {
                default: "bg-card",
                glass: "bg-white/10 dark:bg-black/20 backdrop-blur-md border-white/20 dark:border-white/10",
                "glass-light":
                    "bg-white/20 dark:bg-black/30 backdrop-blur-lg border-white/30 dark:border-white/15",
                "glass-dark":
                    "bg-black/40 dark:bg-black/50 backdrop-blur-xl border-white/15 dark:border-white/10",
                "glass-gradient":
                    "bg-gradient-to-br from-white/20 to-white/5 dark:from-black/30 dark:to-black/10 backdrop-blur-md border-white/20",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

interface CardProps
    extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {}

function Card({ className, variant, ...props }: CardProps) {
    return (
        <div
            data-slot="card"
            className={cn(cardVariants({ variant }), "py-6", className)}
            {...props}
        />
    );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardAction,
    CardDescription,
    CardContent,
};
