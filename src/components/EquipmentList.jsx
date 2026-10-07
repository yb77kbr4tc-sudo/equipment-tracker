import React from 'react'
import { Trash2, Edit2, AlertCircle } from 'lucide-react'

function EquipmentList({ equipment, onDelete, onEdit }) {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'assigned':
        return 'bg-blue-100 text-blue-800'
      case 'maintenance':
        return 'bg-orange-100 text-orange-800'
      case 'broken':
        return 'bg-red-100 text-red-800'
      case 'retired':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent':
        return 'text-green-600'
      case 'good':
        return 'text-blue-600'
      case 'fair':
        return 'text-yellow-600'
      case 'poor':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (equipment.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 text-lg">No equipment found</p>
        <p className="text-gray-400 text-sm">Add your first equipment to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {equipment.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-md transition p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500">S/N: {item.serialNumber}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadgeColor(item.status)}`}>
              {item.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-medium text-gray-900">{item.category}</p>
            </div>
            <div>
              <p className="text-gray-500">Quantity</p>
              <p className="font-medium text-gray-900">{item.quantity}</p>
            </div>
            <div>
              <p className="text-gray-500">Condition</p>
              <p className={`font-medium capitalize ${getConditionColor(item.condition)}`}>{item.condition}</p>
            </div>
            <div>
              <p className="text-gray-500">Purchased</p>
              <p className="font-medium text-gray-900">{new Date(item.purchaseDate).toLocaleDateString()}</p>
            </div>
          </div>

          {item.project && (
            <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
              <p className="text-gray-600"><strong>Project:</strong> {item.project}</p>
            </div>
          )}

          {item.maintenanceDate && (
            <div className="mb-3 text-xs text-gray-600">
              <strong>Maintenance Due:</strong> {new Date(item.maintenanceDate).toLocaleDateString()}
            </div>
          )}

          {item.notes && (
            <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
              {item.notes}
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => onEdit(item.id)}
              className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition text-sm"
            >
              <Edit2 size={16} /> Edit
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete ${item.name}?`)) {
                  onDelete(item.id)
                }
              }}
              className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded transition text-sm"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EquipmentList
