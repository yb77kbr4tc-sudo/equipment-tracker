import React from 'react'
import { AlertTriangle, Edit3, Trash2, LogOut, LogIn } from 'lucide-react'

const statusStyles = {
  available: 'bg-emerald-100 text-emerald-800',
  assigned: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-amber-100 text-amber-800',
  broken: 'bg-rose-100 text-rose-800',
  retired: 'bg-slate-200 text-slate-700',
}

function EquipmentList({ equipment, onDelete, onEdit, onCheckOut, onCheckIn }) {
  if (!equipment.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center sm:p-12">
        <AlertTriangle size={42} className="mx-auto mb-3 text-slate-400" />
        <p className="text-lg font-semibold text-slate-700 sm:text-xl">No equipment matches your filters</p>
        <p className="mt-2 text-sm text-slate-500">Try adjusting the search or add a new tool to the system.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {equipment.map((item) => {
        const dueReturn = item.dueReturnDate ? new Date(item.dueReturnDate) : null
        const isOverdue = dueReturn && dueReturn < new Date()
        const isDueSoon = dueReturn && !isOverdue && (dueReturn - new Date()) <= 3 * 24 * 60 * 60 * 1000

        return (
          <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:shadow-md sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 sm:text-xl">{item.name}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusStyles[item.status] || 'bg-slate-200 text-slate-700'}`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">Serial: {item.serialNumber}</p>
              </div>

              <div className="flex w-full gap-2 md:w-auto">
                {item.status === 'available' ? (
                  <button
                    onClick={() => onCheckOut(item.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 md:flex-initial"
                  >
                    <LogOut size={15} /> Check out
                  </button>
                ) : (
                  <button
                    onClick={() => onCheckIn(item.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 md:flex-initial"
                  >
                    <LogIn size={15} /> Check in
                  </button>
                )}

                <button
                  onClick={() => onEdit(item.id)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 md:flex-initial"
                >
                  <Edit3 size={15} /> Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${item.name}?`)) {
                      onDelete(item.id)
                    }
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 md:flex-initial"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Category</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{item.category}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Condition</p>
                <p className="mt-1 text-sm font-medium capitalize text-slate-800">{item.condition}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Quantity</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{item.quantity || 1}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Maintenance</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {item.maintenanceDate ? new Date(item.maintenanceDate).toLocaleDateString() : 'Not set'}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Project</p>
                <p className="mt-1 text-sm text-slate-700">{item.project || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Location</p>
                <p className="mt-1 text-sm text-slate-700">{item.location || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Assigned to</p>
                <p className="mt-1 text-sm text-slate-700">{item.assignedTo || '—'}</p>
              </div>
            </div>

            {item.dueReturnDate && (
              <div className={`mt-4 rounded-xl p-3 text-sm ${isOverdue ? 'bg-rose-100 text-rose-800' : isDueSoon ? 'bg-amber-100 text-amber-800' : 'bg-white text-slate-700'}`}>
                <span className="font-semibold">Return due:</span> {new Date(item.dueReturnDate).toLocaleDateString()}
                {isOverdue ? ' (overdue)' : isDueSoon ? ' (due soon)' : ' (on schedule)'}
              </div>
            )}

            {item.lastCheckedOut && (
              <div className="mt-4 rounded-xl bg-white p-3 text-sm text-slate-700">
                <span className="font-semibold text-slate-800">Last check-out:</span>{' '}
                {new Date(item.lastCheckedOut).toLocaleString()}
              </div>
            )}

            {item.notes && (
              <div className="mt-4 rounded-xl bg-white p-3 text-sm text-slate-700">
                <span className="font-semibold text-slate-800">Notes:</span> {item.notes}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default EquipmentList
