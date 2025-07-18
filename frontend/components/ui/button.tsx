import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-[var(--color-primary-dark)] focus-visible:ring-[var(--color-primary-dark)]/50 focus-visible:ring-[3px] aria-invalid:ring-[var(--color-danger)]/20 aria-invalid:border-[var(--color-danger)]",
	{
		variants: {
			variant: {
				default:
					"bg-[var(--color-primary-dark)] text-[var(--color-surface)] shadow-xs hover:bg-[var(--color-primary-light)] cursor-pointer",
				destructive:
					"bg-[var(--color-danger)] text-[var(--color-surface)] shadow-xs hover:bg-[var(--color-warning)] focus-visible:ring-[var(--color-danger)]/20",
				outline:
					"bg-[var(--color-surface)] cursor-pointer text-[var(--color-primary-dark)] shadow-xs",
				secondary:
					"bg-[var(--color-primary-light)] text-[var(--color-surface)] shadow-xs hover:bg-[var(--color-primary-dark)]",
				ghost:
					"bg-transparent text-[var(--color-primary-dark)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary-light)]",
				link: "text-[var(--color-primary-dark)] cursor-pointer hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
