import React from 'react'
import { Wrench, AlertCircle, CheckCircle, Zap } from 'lucide-react'

function Dashboard({ equipment }) {
  const stats = {
    total: equipment.length,
    available: equipment.filter(e => e.status === 'available').length,
    assigned: equipment.filter(e => e.status === 'assigned').length,
    maintenance: equipment.filter(e => e.status === 'maintenance').length,
    broken: equipment.filter(e => e.status === 'broken').length,
  }

  const cards = [
    {
      title: 'Total Equipment',
      value: stats.total,
      icon: Wrench,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'Available',
      value: stats.available,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      title: 'Assigned',
      value: stats.assigned,
      icon: Zap,
      color: 'bg-yellow-50 text-yellow-600 border-yellow-200'
    },
    {
      title: 'Maintenance',
      value: stats.maintenance,
      icon: AlertCircle,
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.title} className={`${card.color} border rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-75">{card.title}</p>
                <p className="text-3xl font-bold mt-1">{card.value}</p>
              </div>
              <Icon size={32} className="opacity-20" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Dashboard
