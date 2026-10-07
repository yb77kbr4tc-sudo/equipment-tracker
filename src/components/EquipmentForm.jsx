import React from 'react'
import { AlertTriangle, CheckCircle2, ToolCase, Wrench } from 'lucide-react'

function Dashboard({ equipment }) {
  const stats = {
    total: equipment.length,
    available: equipment.filter((item) => item.status === 'available').length,
    assigned: equipment.filter((item) => item.status === 'assigned').length,
    maintenance: equipment.filter((item) => item.status === 'maintenance').length,
    broken: equipment.filter((item) => item.status === 'broken').length,
  }

  const cards = [
    { title: 'Total tools', value: stats.total, icon: ToolCase, tone: 'bg-blue-50 text-blue-700' },
    { title: 'Available', value: stats.available, icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-700' },
    { title: 'Assigned', value: stats.assigned, icon: Wrench, tone: 'bg-amber-50 text-amber-700' },
    { title: 'Maintenance', value: stats.maintenance + stats.broken, icon: AlertTriangle, tone: 'bg-rose-50 text-rose-700' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ title, value, icon: Icon, tone }) => (
        <div key={title} className={`${tone} rounded-2xl border border-slate-200 p-5 shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-75">{title}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
            </div>
            <div className="rounded-xl bg-white/60 p-3">
              <Icon size={26} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Dashboard
