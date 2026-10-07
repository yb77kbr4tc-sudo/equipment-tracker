import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Download, FileSpreadsheet, Plus, Search, Upload } from 'lucide-react'
import Dashboard from './components/Dashboard'
import EquipmentForm from './components/EquipmentForm'
import EquipmentList from './components/EquipmentList'
import { parseExcelFile } from './utils/excelImport'
import { sampleEquipment } from './data/sampleData'

const STORAGE_KEY = 'construction-equipment-tracker-v2'

function App() {
  const fileInputRef = useRef(null)
  const [equipment, setEquipment] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return sampleEquipment
      }
    }
    return sampleEquipment
  })

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [importMessage, setImportMessage] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(equipment))
  }, [equipment])

  const categories = useMemo(
    () => ['all', ...new Set(equipment.map((item) => item.category).filter(Boolean))],
    [equipment],
  )

  const filteredEquipment = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    const filtered = equipment.filter((item) => {
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      const matchesSearch =
        !query ||
        [item.name, item.serialNumber, item.project, item.location, item.assignedTo]
          .join(' ')
          .toLowerCase()
          .includes(query)

      return matchesStatus && matchesCategory && matchesSearch
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'status':
          return a.status.localeCompare(b.status)
        case 'project':
          return (a.project || '').localeCompare(b.project || '')
        case 'maintenance':
          return (a.maintenanceDate || '').localeCompare(b.maintenanceDate || '')
        default:
          return a.name.localeCompare(b.name)
      }
    })
  }, [equipment, filterStatus, selectedCategory, searchTerm, sortBy])

  const editingEquipment = editingId ? equipment.find((item) => item.id === editingId) : null

  const addEquipment = (newEquipment) => {
    if (editingId) {
      setEquipment((prev) =>
        prev.map((item) => (item.id === editingId ? { ...newEquipment, id: editingId } : item)),
      )
      setEditingId(null)
    } else {
      const nextId = Date.now() + Math.floor(Math.random() * 1000)
      setEquipment((prev) => [...prev, { ...newEquipment, id: nextId }])
    }

    setShowForm(false)
  }

  const deleteEquipment = (id) => {
    setEquipment((prev) => prev.filter((item) => item.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setShowForm(false)
    }
  }

  const editEquipment = (id) => {
    setEditingId(id)
    setShowForm(true)
  }

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const imported = await parseExcelFile(file)
      if (!imported.length) {
        setImportMessage('No valid rows were found in the file. Check the template format.')
        event.target.value = ''
        return
      }

      const nextItems = [...equipment]
      const serialMap = new Map(nextItems.map((item) => [String(item.serialNumber).toLowerCase(), item]))

      imported.forEach((item) => {
        const key = String(item.serialNumber || '').toLowerCase()
        if (!key) return

        if (serialMap.has(key)) {
          const index = nextItems.findIndex((existing) => String(existing.serialNumber).toLowerCase() === key)
          if (index >= 0) {
            nextItems[index] = { ...nextItems[index], ...item }
          }
        } else {
          nextItems.push({ ...item, id: Date.now() + Math.random() })
          serialMap.set(key, item)
        }
      })

      setEquipment(nextItems)
      setImportMessage(`Imported ${imported.length} equipment records successfully.`)
    } catch (error) {
      console.error(error)
      setImportMessage('Import failed. Please verify the file is a valid Excel or CSV file.')
    } finally {
      event.target.value = ''
    }
  }

  const downloadTemplate = () => {
    const csvContent = `Name,Category,Serial Number,Status,Project,Condition,Quantity,Purchase Date,Maintenance Date,Location,Assigned To,Notes
Excavator CAT 320,Heavy Equipment,CAT-320-001,assigned,Downtown Bridge Project,good,1,2021-06-15,2026-09-20,Site A,John Smith,Recently serviced
Concrete Mixer,Tools,MIX-1001,available,,good,2,2023-03-10,2026-08-15,Warehouse,,Ready for dispatch
Scaffolding Kit,Safety Equipment,SCAF-902,maintenance,,fair,5,2020-01-20,2026-10-10,Storage Yard,,Inspection due
`

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'equipment-template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-xs">Operations suite</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Construction Equipment Tracker</h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <button
              onClick={downloadTemplate}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              <Download size={16} /> Download Template
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              <Upload size={16} /> Import Excel
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImport}
              className="hidden"
            />

            <button
              onClick={() => {
                setEditingId(null)
                setShowForm(true)
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:w-auto"
            >
              <Plus size={16} /> Add Tool
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-3 text-center text-sm font-medium text-blue-800 sm:p-4">
          Mobile and tablet friendly layout for site teams and field supervisors.
        </div>

        <Dashboard equipment={equipment} />

        {importMessage && (
          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
            {importMessage}
          </div>
        )}

        <div className="mt-8 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              {showForm && (
                <EquipmentForm
                  initialData={editingEquipment}
                  onSubmit={addEquipment}
                  onCancel={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                />
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center gap-2 text-slate-900">
                <Search size={18} className="text-blue-600" />
                <h3 className="text-lg font-semibold">Filters & Search</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Search</label>
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Name, serial, project..."
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  >
                    <option value="all">All statuses</option>
                    <option value="available">Available</option>
                    <option value="assigned">Assigned</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="broken">Broken</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All categories' : category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  >
                    <option value="name">Name</option>
                    <option value="status">Status</option>
                    <option value="project">Project</option>
                    <option value="maintenance">Maintenance due</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Equipment Inventory</h2>
                <p className="text-sm text-slate-500">{filteredEquipment.length} active records</p>
              </div>

              <div className="inline-flex items-center justify-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                <FileSpreadsheet className="mr-1 inline-block" size={12} /> Excel ready
              </div>
            </div>

            <EquipmentList equipment={filteredEquipment} onDelete={deleteEquipment} onEdit={editEquipment} />
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
