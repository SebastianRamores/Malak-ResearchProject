import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  color?: string; // Tailwind color class like 'text-blue-500'
  bgClass?: string;
}

export function StatCard({ label, value, icon: Icon, trend, color = "text-primary", bgClass = "bg-primary/10" }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h3 className="text-3xl font-bold mt-2 font-display text-slate-800 group-hover:scale-105 transition-transform origin-left">
            {value}
          </h3>
          {trend && (
            <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bgClass}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
}
