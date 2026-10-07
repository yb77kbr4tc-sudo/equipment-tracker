import React, { useState, useEffect } from 'react'
import EquipmentList from './components/EquipmentList'
import EquipmentForm from './components/EquipmentForm'
import Dashboard from './components/Dashboard'
import { Plus, Menu, X } from 'lucide-react'

function App() {
  const [equipment, setEquipment] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('equipment')
    if (saved) {
      setEquipment(JSON.parse(saved))
    } else {
      // Load sample data
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
          notes: 'Recently serviced'
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
          notes: ''
        },
        {
          id: 3,
          name: 'Scaffolding Kit',
          category: 'Safety Equipment',
          serialNumber: 'SCAF-BUNDLE-12',
          status: 'maintenance',
          project: '',
          condition: 'fair',
          purchaseDate: '2020-01-20',
          maintenanceDate: '2026-10-10',
          quantity: 5,
          notes: 'Inspection due'
        }
      ])
    }
  }, [])

  // Save to localStorage whenever equipment changes
  useEffect(() => {
    localStorage.setItem('equipment', JSON.stringify(equipment))
  }, [equipment])

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

  const filteredEquipment = equipment.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.project.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const editingEquipment = editingId ? equipment.find(e => e.id === editingId) : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">🔧 Equipment Tracker</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Dashboard */}
          <div className="lg:col-span-4">
            <Dashboard equipment={equipment} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <button
                onClick={() => {
                  setEditingId(null)
                  setShowForm(!showForm)
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Plus size={20} /> Add Equipment
              </button>

              {showForm && (
                <EquipmentForm
                  onSubmit={addEquipment}
                  onCancel={() => setShowForm(false)}
                  initialData={editingEquipment}
                />
              )}

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Filter by Status</h3>
                <div className="space-y-2">
                  {['all', 'available', 'assigned', 'maintenance', 'broken', 'retired'].map(status => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={filterStatus === status}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="rounded"
                      />
                      <span className="capitalize text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Search</h3>
                <input
                  type="text"
                  placeholder="Name, Serial #, Project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Equipment List */}
          <div className="lg:col-span-2">
            <EquipmentList
              equipment={filteredEquipment}
              onDelete={deleteEquipment}
              onEdit={editEquipment}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
