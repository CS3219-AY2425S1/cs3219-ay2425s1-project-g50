import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Main Dialog container
const dialogVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "w-full h-full",
      },
    },
    defaultVariants: {
      size: "full",
    },
  }
);

const Dialog = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof dialogVariants>
>(({ className, size, ...props }, ref) => (
  <div ref={ref} className={cn(dialogVariants({ size }), className)} {...props} />
));
Dialog.displayName = "Dialog";

const DialogTrigger = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button onClick={onClick} className="rounded-lg bg-blue-500 p-2 text-white">
    {children}
  </button>
);

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mb-4 border-b pb-2", className)} {...props} />
));
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-bold", className)} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-full max-w-lg rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg",
      className
    )}
    {...props}
  />
));
DialogContent.displayName = "DialogContent";

const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex justify-end space-x-2 mt-3", className)} {...props} />
));
DialogFooter.displayName = "DialogFooter";

const DialogCloseButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button onClick={onClick} className="rounded-lg bg-red-500 p-2 text-white">
    {children}
  </button>
);

export { 
  Dialog, 
  DialogTrigger, 
  DialogHeader, 
  DialogTitle, 
  DialogContent, 
  DialogFooter, 
  DialogCloseButton 
};