import * as React from "react"
import { cn } from "@/lib/utils"

// Since I don't have cva installed yet, I'll install it or just write a simpler version. 
// Ah, `class-variance-authority` is standard in shadcn-like setups but I didn't install it. 
// I will write a simpler version to avoid extra deps for now, or just install it quickly.
// Let's stick to a simpler implementation for now to avoid dependency hell, but make it robust.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {

        const variants = {
            default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20",
            destructive: "bg-red-500 text-white hover:bg-red-600",
            outline: "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-100",
            secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
            ghost: "hover:bg-slate-800 text-slate-100",
            link: "text-indigo-400 underline-offset-4 hover:underline",
        }

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
        }

        const Comp = "button"
        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
