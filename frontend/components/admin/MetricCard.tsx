import React from 'react'

interface MetricCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: React.ReactNode
  iconBgColor?: string
  trend?: string
  trendPositive?: boolean
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-blue-50 text-blue-600',
  trend,
  trendPositive = true,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor}`}>
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-gray-500">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold ${
                trendPositive ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

