"use client";

import { FC } from "react";
import {
	User,
	BookOpen,
	Wallet,
	History,
	ShoppingBag,
	Settings,
	BarChart2,
	LogOut,
	Award,
	ChevronRight,
	ChevronLeft,
	Loader2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useLogout } from "@/hooks/auth/useLogout";
import { useRouter } from "next/navigation";

interface SidebarProps {
	activeSection: string;
	setActiveSection: (section: string) => void;
	isInstructor?: boolean;
	collapsed?: boolean;
	toggleCollapse?: () => void;
	loadingSection?: string | null;
}

const Sidebar: FC<SidebarProps> = ({
	activeSection,
	setActiveSection,
	isInstructor = false,
	collapsed = false,
	toggleCollapse,
	loadingSection,
}) => {
	const { mutate: logout, isPending: isLoggingOut } = useLogout();
	const router = useRouter();

	const navigationItems = isInstructor
		? [
				{ id: "profile", label: "Profile", icon: User },
				{ id: "courses", label: "My Courses", icon: BookOpen },
				{ id: "earnings", label: "Earnings", icon: Wallet },
				{ id: "analytics", label: "Analytics", icon: BarChart2 },
				{ id: "settings", label: "Settings", icon: Settings },
			]
		: [
				{ id: "profile", label: "Profile", icon: User },
				{ id: "courses", label: "My Courses", icon: BookOpen },
				{ id: "certificates", label: "Certificates", icon: Award },
				{ id: "wallet", label: "Wallet", icon: Wallet },
				{ id: "transactions", label: "Transactions", icon: History },
				{ id: "orders", label: "Orders", icon: ShoppingBag },
			];

	return (
		<div
			className={cn(
				"w-full h-full bg-[var(--color-surface)]  flex flex-col relative transition-all duration-300",
				"shadow-lg",
				"z-[60]",
			)}
		>
			{/* Collapse/Expand Chevron - always visible on mobile, at the very top when collapsed or expanded */}
			{collapsed ? (
				<button
					className="md:hidden w-full h-14 flex items-center justify-center border-b border-[var(--color-muted)] bg-[var(--color-surface)] focus:outline-none z-20"
					onClick={toggleCollapse}
					aria-label="Expand sidebar"
					type="button"
				>
					<ChevronRight className="w-6 h-6 text-gray-500" />
				</button>
			) : (
				<button
					className="md:hidden w-full h-14 flex items-center justify-center border-b border-[var(--color-muted)] bg-[var(--color-surface)] focus:outline-none z-20"
					onClick={toggleCollapse}
					aria-label="Collapse sidebar"
					type="button"
				>
					<ChevronLeft className="w-6 h-6 text-gray-500" />
				</button>
			)}
			{/* Navigation */}
			<nav
				className={cn(
					"flex-1 flex flex-col gap-1 py-4 md:py-6 transition-all duration-300",
					collapsed ? "items-center" : "px-3",
				)}
			>
				{navigationItems.map((item) => {
					const Icon = item.icon;
					const isLoading = loadingSection === item.id;
					return (
						<button
							key={item.id}
							onClick={() => setActiveSection(item.id)}
							className={cn(
								"flex items-center gap-3 w-full rounded-lg transition-all duration-200",
								collapsed
									? "justify-center p-0 w-12 h-12"
									: "px-4 py-3 text-sm font-medium",
								"hover:bg-[var(--color-background)] active:bg-[var(--color-primary-light)]",
								activeSection === item.id
									? "bg-[var(--color-primary-light)]/20 text-[var(--color-primary-light)]"
									: "text-[var(--color-muted)]",
							)}
							title={item.label}
							disabled={isLoading}
						>
							{isLoading ? (
								<Loader2 className="w-5 h-5 animate-spin text-[var(--color-primary-light)]" />
							) : (
								<Icon className="w-5 h-5 flex-shrink-0" />
							)}
							{/* Only show text if not collapsed or on desktop */}
							<span
								className={cn(
									"truncate",
									collapsed ? "hidden" : "inline",
									"md:inline",
								)}
							>
								{isLoading ? "Loading..." : item.label}
							</span>
						</button>
					);
				})}
				{/* Logout Button - now directly after menu */}
				<div
					className={cn(
						"mt-4 border-t border-[var(--color-muted)] pt-3 w-full",
						collapsed ? "flex flex-col items-center" : "",
					)}
				>
					<button
						onClick={() => {
							logout(undefined, {
								onSuccess: () => {
									router.push("/login");
								},
								onError: (error) => {
									console.error("Logout failed:", error);
									// Even if logout fails, redirect to login page
									router.push("/login");
								},
							});
						}}
						disabled={isLoggingOut}
						className={cn(
							"flex items-center gap-3 w-full rounded-lg transition-all duration-200",
							collapsed
								? "justify-center p-0 w-12 h-12 mt-2"
								: "px-4 py-3 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 mt-2",
							"hover:bg-[var(--color-danger)]/10 disabled:opacity-50",
						)}
						title="Logout"
					>
						<LogOut className="w-5 h-5 flex-shrink-0" />
						<span
							className={cn(
								"text-sm font-medium truncate",
								collapsed ? "hidden" : "inline",
								"md:inline",
							)}
						>
							{isLoggingOut ? "Logging out..." : "Logout"}
						</span>
					</button>
				</div>
			</nav>
		</div>
	);
};

export default Sidebar;
