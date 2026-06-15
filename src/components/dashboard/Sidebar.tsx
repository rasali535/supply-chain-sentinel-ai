"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Users, 
  ActivitySquare, 
  Lightbulb, 
  GitMerge,
  PlayCircle
} from "lucide-react";
import { cn } from "../../lib/utils";

const routes = [
  {
    label: "Executive Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Risk Monitor",
    icon: ShieldAlert,
    href: "/dashboard/risk",
    color: "text-red-500",
  },
  {
    label: "Supplier Intelligence",
    icon: Users,
    href: "/dashboard/suppliers",
    color: "text-emerald-500",
  },
  {
    label: "Agent Activity",
    icon: ActivitySquare,
    href: "/dashboard/activity",
    color: "text-purple-500",
  },
  {
    label: "Strategy Center",
    icon: Lightbulb,
    href: "/dashboard/strategy",
    color: "text-amber-500",
  },
  {
    label: "Workflow Visualization",
    icon: GitMerge,
    href: "/dashboard/workflow",
    color: "text-indigo-500",
  },
  {
    label: "Live Demo Mode",
    icon: PlayCircle,
    href: "/dashboard/demo",
    color: "text-rose-400 font-bold",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-950 text-white border-r border-slate-800">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4 flex items-center justify-center bg-indigo-600 rounded-lg">
             <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Sentinel <span className="text-indigo-400">AI</span>
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
                route.href === "/dashboard/demo" ? "mt-8 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]" : "font-medium"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                <span className={route.color}>{route.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
