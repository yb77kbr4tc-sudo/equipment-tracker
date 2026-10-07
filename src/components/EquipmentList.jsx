import React, { useState, useEffect } from 'react'
import EquipmentList from './components/EquipmentList'
import EquipmentForm from './components/EquipmentForm'
import Dashboard from './components/Dashboard'
import { Plus, Menu, X, Download, Smartphone, Search } from 'lucide-react'

function App() {
  const [equipment, setEquipment] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDueReturn, setFilterDueReturn] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768)

  useEffect(() => {
    const saved = localStorage.getItem('equipment')
    if (saved) {
      setEquipment(JSON.parse(saved))
    } else {
      setEquipment([
        {
          id: 1,
          name: 'Excavator CAT 320',
          category: 'Heavy Equipment',
          serialNumber: 'CAT-320-001',
          status: 'assigned',
          project: 'Downtown Bridge Project',
          condition: 'good',
          purchaseDate: '2021-06-15',
          maintenanceDate: '2026-09-20',
          quantity: 1,
          notes: 'Recently serviced',
          assignedTo: 'John Smith',
          lastCheckedOut: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          dueReturnDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString()
        },
        {
          id: 2,
          name: 'Concrete Mixer',
          category: 'Tools',
          serialNumber: 'MIX-2024-005',
          status: 'available',
          project: '',
          condition: 'good',
          purchaseDate: '2023-03-10',
          maintenanceDate: '2026-08-15',
          quantity: 2,
          notes: '',
          assignedTo: '',
          lastCheckedOut: '',
          dueReturnDate: ''
        },
        {
          id: 3,
          name: 'Scaffolding Kit',
          category: 'Safety Equipment',
          serialNumber: 'SCAF-BUNDLE-12',
          status: 'assigned',
          project: 'Site B',
          condition: 'fair',
          purchaseDate: '2020-01-20',
          maintenanceDate: '2026-10-10',
          quantity: 5,
          notes: 'Inspection due',
          assignedTo: 'Project Crew',
          lastCheckedOut: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
          dueReturnDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
        }
      ])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('equipment', JSON.stringify(equipment))
  }, [equipment])

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault()
      setInstallPrompt(event)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const addEquipment = (newEquipment) => {
    if (editingId) {
      setEquipment(equipment.map(e => e.id === editingId ? { ...newEquipment, id: editingId } : e))
      setEditingId(null)
    } else {
      const id = Math.max(...equipment.map(e => e.id), 0) + 1
      setEquipment([...equipment, { ...newEquipment, id }])
    }
    setShowForm(false)
  }

  const deleteEquipment = (id) => {
    setEquipment(equipment.filter(e => e.id !== id))
  }

  const editEquipment = (id) => {
    setEditingId(id)
    setShowForm(true)
  }

  const handleCheckOut = (id) => {
    const item = equipment.find((entry) => entry.id === id)
    if (!item) return

    const assignee = window.prompt('Check out to:', item.assignedTo || 'Field Crew')
    if (assignee === null) return

    const site = window.prompt('Project or site name:', item.project || '')
    if (site === null) return

    const dueDate = window.prompt('Return due date (YYYY-MM-DD):', item.dueReturnDate ? new Date(item.dueReturnDate).toISOString().slice(0, 10) : '')
    if (dueDate === null) return

    setEquipment((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status: 'assigned',
              assignedTo: assignee.trim() || 'Field Crew',
              project: site.trim() || entry.project || 'Field use',
              location: entry.location || 'Site stock',
              lastCheckedOut: new Date().toISOString(),
              dueReturnDate: dueDate ? new Date(dueDate).toISOString() : '',
            }
          : entry,
      ),
    )
  }

  const handleCheckIn = (id) => {
    setEquipment((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status: 'available',
              assignedTo: '',
              project: '',
              location: entry.location || 'Warehouse',
              lastCheckedOut: '',
              dueReturnDate: '',
            }
          : entry,
      ),
    )
  }

  const filteredEquipment = equipment.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    const matchesDueReturn = (() => {
      if (filterDueReturn === 'all') return true
      if (!item.dueReturnDate) return false

      const dueDate = new Date(item.dueReturnDate)
      const today = new Date()
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))

      if (filterDueReturn === 'overdue') return diffDays < 0
      if (filterDueReturn === 'dueToday') return diffDays === 0
      if (filterDueReturn === 'dueSoon') return diffDays > 0 && diffDays <= 3
      return true
    })()

    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.project || '').toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesDueReturn && matchesSearch
  })

  const editingEquipment = editingId ? equipment.find(e => e.id === editingId) : null

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-blue-600">Site ops</p>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Equipment Tracker</h1>
          </div>

          <div className="flex items-center gap-2">
            {installPrompt && (
              <button
                onClick={handleInstall}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Download size={15} /> Install
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 rounded-2xl border border-blue-200 bg-blue-50 px-3 py-3 text-sm font-medium text-blue-800 flex items-center gap-2">
          <Smartphone size={18} />
          <span>Optimized for mobile, tablet, and field use.</span>
        </div>

        <Dashboard equipment={equipment} />

        {mobileMenuOpen && isMobileView && (
          <div className="mt-4 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="space-y-3">
              <button
                onClick={() => {
                  setEditingId(null)
                  setShowForm(!showForm)
                  setMobileMenuOpen(false)
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add Equipment
              </button>

              <div className="relative">
                <Search className="absolute left-3 top-3.5 text-slate-400" size={16} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search equipment"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="all">All statuses</option>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="maintenance">Maintenance</option>
                <option value="broken">Broken</option>
                <option value="retired">Retired</option>
              </select>

              <select
                value={filterDueReturn}
                onChange={(e) => setFilterDueReturn(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="all">All due return</option>
                <option value="overdue">Overdue</option>
                <option value="dueToday">Due today</option>
                <option value="dueSoon">Due in next 3 days</option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          {!isMobileView && (
            <aside className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {showForm && (
                  <EquipmentForm
                    initialData={editingEquipment}
                    onSubmit={addEquipment}
                    onCancel={() => setShowForm(false)}
                  />
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-slate-900">
                  <Search size={18} className="text-blue-600" />
                  <h3 className="text-lg font-semibold">Filters</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Search</label>
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Name, serial, project..."
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
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
                    <label className="mb-2 block text-sm font-medium text-slate-700">Due return</label>
                    <select
                      value={filterDueReturn}
                      onChange={(e) => setFilterDueReturn(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="all">All due return</option>
                      <option value="overdue">Overdue</option>
                      <option value="dueToday">Due today</option>
                      <option value="dueSoon">Due in 3 days</option>
                    </select>
                  </div>
                </div>
              </div>
            </aside>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Equipment Inventory</h2>
                <p className="text-sm text-slate-500">{filteredEquipment.length} records</p>
              </div>
            </div>

            <EquipmentList
              equipment={filteredEquipment}
              onDelete={deleteEquipment}
              onEdit={editEquipment}
              onCheckOut={handleCheckOut}
              onCheckIn={handleCheckIn}
            />
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
