import React from 'react'
import { AlertTriangle, Edit3, Trash2 } from 'lucide-react'

const statusStyles = {
  available: 'bg-emerald-100 text-emerald-800',
  assigned: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-amber-100 text-amber-800',
  broken: 'bg-rose-100 text-rose-800',
  retired: 'bg-slate-200 text-slate-700',
}

function EquipmentList({ equipment, onDelete, onEdit }) {
  if (!equipment.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
        <AlertTriangle size={42} className="mx-auto mb-3 text-slate-400" />
        <p className="text-xl font-semibold text-slate-700">No equipment matches your filters</p>
        <p className="mt-2 text-sm text-slate-500">Try adjusting the search or add a new tool to the system.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {equipment.map((item) => (
        <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:shadow-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusStyles[item.status] || 'bg-slate-200 text-slate-700'}`}>
                  {item.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">Serial: {item.serialNumber}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(item.id)}
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                <Edit3 size={15} /> Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Delete ${item.name}?`)) {
                    onDelete(item.id)
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{item.category}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Condition</p>
              <p className="mt-1 text-sm font-medium capitalize text-slate-800">{item.condition}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quantity</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{item.quantity || 1}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Maintenance</p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {item.maintenanceDate ? new Date(item.maintenanceDate).toLocaleDateString() : 'Not set'}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Project</p>
              <p className="mt-1 text-sm text-slate-700">{item.project || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</p>
              <p className="mt-1 text-sm text-slate-700">{item.location || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Assigned to</p>
              <p className="mt-1 text-sm text-slate-700">{item.assignedTo || '—'}</p>
            </div>
          </div>

          {item.notes && (
            <div className="mt-4 rounded-xl bg-white p-3 text-sm text-slate-700">
              <span className="font-semibold text-slate-800">Notes:</span> {item.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default EquipmentList
