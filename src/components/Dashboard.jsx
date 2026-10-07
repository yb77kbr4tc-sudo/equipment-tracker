import React from 'react'
import { AlertCircle, CheckCircle, Clock, Wrench } from 'lucide-react'

function Dashboard({ equipment }) {
  const stats = [
    {
      label: 'Total Equipment',
      value: equipment.length,
      icon: Wrench,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Available',
      value: equipment.filter(e => e.status === 'available').length,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'In Maintenance',
      value: equipment.filter(e => e.status === 'maintenance').length,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      label: 'Issues',
      value: equipment.filter(e => e.status === 'broken' || e.status === 'retired').length,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Dashboard
