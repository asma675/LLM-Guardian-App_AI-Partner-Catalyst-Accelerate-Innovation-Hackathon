import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Providers } from "./providers";
import { Shield, LayoutDashboard, TriangleAlert, Activity, FileText, Play } from "lucide-react";

export const metadata: Metadata = {
  title: "LLM Guardian",
  description: "AI Reliability & Incident Copilot",
};

const NavItem = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <Providers>
          <div className="mx-auto max-w-7xl px-4 py-6">
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500/15 p-2 ring-1 ring-indigo-400/30">
                  <Shield className="h-5 w-5 text-indigo-300" />
                </div>
                <div>
                  <div className="text-lg font-semibold">LLM Guardian</div>
                  <div className="text-xs text-slate-400">AI Reliability & Incident Copilot</div>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200 ring-1 ring-emerald-400/20">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                All systems operational
              </div>
            </div>

            {/* Top Nav */}
            <nav className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl bg-white/3 p-2 ring-1 ring-white/10">
              <NavItem href="/dashboard" label="Dashboard" icon={<LayoutDashboard className="h-4 w-4" />} />
              <NavItem href="/incidents" label="Incidents" icon={<TriangleAlert className="h-4 w-4" />} />
              <NavItem href="/monitors" label="Monitors" icon={<Activity className="h-4 w-4" />} />
              <NavItem href="/logs" label="Logs" icon={<FileText className="h-4 w-4" />} />
              <NavItem href="/simulate" label="Simulate" icon={<Play className="h-4 w-4" />} />
            </nav>

            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
