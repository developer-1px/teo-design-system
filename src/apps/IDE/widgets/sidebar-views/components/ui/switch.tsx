import * as React from "react"
import { cn } from "@/shared/lib/utils"

const Switch = React.forwardRef<
    React.ElementRef<"button">,
    React.ComponentPropsWithoutRef<"button"> & { checked?: boolean }
>(({ className, checked, ...props }, ref) => (
    <button
        className={cn(
            "peer inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
            checked ? "bg-accent" : "bg-slate-200",
            className
        )}
        role="switch"
        data-state={checked ? "checked" : "unchecked"}
        {...props}
        ref={ref}
    >
        <span
            data-state={checked ? "checked" : "unchecked"}
            className={cn(
                "pointer-events-none block h-4 w-4 rounded-full bg-background ring-0 shadow-lg transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
                checked ? "translate-x-4 bg-white" : "translate-x-0 bg-white"
            )}
        />
    </button>
))
Switch.displayName = "Switch"

export { Switch }
