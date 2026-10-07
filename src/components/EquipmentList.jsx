import React, { useEffect, useState } from 'react'

const emptyForm = {
  name: '',
  category: 'Tools',
  serialNumber: '',
  status: 'available',
  project: '',
  condition: 'good',
  quantity: 1,
  purchaseDate: '',
  maintenanceDate: '',
  location: '',
  assignedTo: '',
  notes: '',
}

function EquipmentForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || emptyForm)

  useEffect(() => {
    setFormData(initialData || emptyForm)
  }, [initialData])

  const handleChange = (event) => {
    const { name, value, type } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.name || !formData.serialNumber) {
      alert('Name and Serial Number are required.')
      return
    }

    onSubmit({
      ...formData,
      quantity: Number(formData.quantity) || 1,
      name: formData.name.trim(),
      serialNumber: formData.serialNumber.trim(),
      project: formData.project.trim(),
      location: formData.location.trim(),
      assignedTo: formData.assignedTo.trim(),
      notes: formData.notes.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{initialData ? 'Edit equipment' : 'Add equipment'}</h3>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Name *</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Excavator CAT 320"
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          >
            <option>Tools</option>
            <option>Heavy Equipment</option>
            <option>Safety Equipment</option>
            <option>Vehicles</option>
            <option>Power Tools</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Serial Number *</label>
          <input
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            placeholder="CAT-320-001"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          >
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="maintenance">Maintenance</option>
            <option value="broken">Broken</option>
            <option value="retired">Retired</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Condition</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Project / Site</label>
          <input
            name="project"
            value={formData.project}
            onChange={handleChange}
            placeholder="Downtown Bridge Project"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Warehouse A / Site #18"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Assigned to</label>
          <input
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            placeholder="John Smith"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Quantity</label>
          <input
            type="number"
            min="1"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Purchase Date</label>
          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Maintenance Due</label>
          <input
            type="date"
            name="maintenanceDate"
            value={formData.maintenanceDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Maintenance notes, comments, or usage information"
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {initialData ? 'Update equipment' : 'Save equipment'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default EquipmentForm
