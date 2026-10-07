import React from 'react'
import { Edit2, Trash2, AlertCircle } from 'lucide-react'

function EquipmentList({ equipment, onDelete, onEdit }) {
  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      assigned: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      broken: 'bg-red-100 text-red-800',
      retired: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getConditionIcon = (condition) => {
    if (condition === 'poor' || condition === 'broken') {
      return <AlertCircle className="text-red-600" size={16} />
    }
    return null
  }

  if (equipment.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Wrench size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">No equipment found</p>
        <p className="text-gray-500 text-sm mt-2">Add your first piece of equipment to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {equipment.map(item => (
        <div key={item.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                {getConditionIcon(item.condition)}
              </div>
              <p className="text-gray-600 text-sm">{item.category}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
            <div>
              <p className="text-gray-500">Serial #</p>
              <p className="text-gray-900 font-mono">{item.serialNumber}</p>
            </div>
            {item.project && (
              <div>
                <p className="text-gray-500">Project</p>
                <p className="text-gray-900">{item.project}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500">Quantity</p>
              <p className="text-gray-900">{item.quantity}</p>
            </div>
            <div>
              <p className="text-gray-500">Condition</p>
              <p className="text-gray-900 capitalize">{item.condition}</p>
            </div>
          </div>

          {item.notes && (
            <div className="mb-4 p-2 bg-gray-50 rounded text-sm text-gray-700">
              <p className="text-gray-600 font-medium mb-1">Notes:</p>
              {item.notes}
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => onEdit(item.id)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Edit"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete ${item.name}?`)) {
                  onDelete(item.id)
                }
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

import { Wrench } from 'lucide-react'
export default EquipmentList
