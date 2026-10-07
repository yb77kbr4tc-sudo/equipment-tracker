import * as XLSX from 'xlsx'

const getValueFromRow = (row, options) => {
  for (const key of options) {
    const found = Object.keys(row).find((rowKey) => {
      const normalized = normalizeKey(rowKey)
      return normalized === normalizeKey(key)
    })

    if (found !== undefined && row[found] !== undefined && row[found] !== null && row[found] !== '') {
      return row[found]
    }
  }

  return ''
}

const normalizeKey = (value = '') => String(value).trim().toLowerCase().replace(/[^a-z0-9]/g, '')

const normalizeStatus = (value = '') => {
  const status = String(value).trim().toLowerCase()
  if (['available', 'ready', 'in stock'].includes(status)) return 'available'
  if (['assigned', 'in use', 'deployed', 'checked out'].includes(status)) return 'assigned'
  if (['maintenance', 'service', 'servicing', 'repair'].includes(status)) return 'maintenance'
  if (['broken', 'damaged', 'faulty', 'repair needed'].includes(status)) return 'broken'
  if (['retired', 'disposed', 'out of service'].includes(status)) return 'retired'
  return 'available'
}

const normalizeCondition = (value = '') => {
  const condition = String(value).trim().toLowerCase()
  if (['excellent', 'new', 'very good'].includes(condition)) return 'excellent'
  if (['good', 'functional'].includes(condition)) return 'good'
  if (['fair', 'average'].includes(condition)) return 'fair'
  if (['poor', 'bad', 'damaged'].includes(condition)) return 'poor'
  return 'good'
}

const parseDateValue = (value) => {
  if (!value && value !== 0) return ''

  if (typeof value === 'number' && value > 10000) {
    const date = XLSX.SSF.parse_date_code(value)
    if (date) {
      const yyyy = date.y
      const mm = String(date.m).padStart(2, '0')
      const dd = String(date.d).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    }
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return ''

    const parsed = new Date(trimmed)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0]
    }

    return trimmed
  }

  return ''
}

export const parseExcelFile = async (file) => {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false })

  const importedRecords = rows
    .map((row) => {
      const name = String(getValueFromRow(row, ['name', 'equipment name', 'item name', 'tool name', 'equipment']) || '').trim()
      const serialNumber = String(getValueFromRow(row, ['serial number', 'serial', 'asset id', 'asset number', 'tag number']) || '').trim()

      if (!name || !serialNumber) {
        return null
      }

      return {
        id: Date.now() + Math.random(),
        name,
        category: String(getValueFromRow(row, ['category', 'type']) || 'Tools').trim() || 'Tools',
        serialNumber,
        status: normalizeStatus(getValueFromRow(row, ['status', 'state'])),
        project: String(getValueFromRow(row, ['project', 'site', 'project site', 'job site']) || '').trim(),
        condition: normalizeCondition(getValueFromRow(row, ['condition', 'health', 'state of equipment'])),
        quantity: Number(getValueFromRow(row, ['quantity', 'qty', 'units']) || 1),
        purchaseDate: parseDateValue(getValueFromRow(row, ['purchase date', 'purchased date', 'date purchased', 'purchase'])),
        maintenanceDate: parseDateValue(getValueFromRow(row, ['maintenance date', 'next maintenance', 'service due', 'maintenance due'])),
        location: String(getValueFromRow(row, ['location', 'warehouse', 'store', 'site location']) || '').trim(),
        assignedTo: String(getValueFromRow(row, ['assigned to', 'assigned', 'operator', 'person in charge']) || '').trim(),
        notes: String(getValueFromRow(row, ['notes', 'remarks', 'description']) || '').trim(),
      }
    })
    .filter(Boolean)

  return importedRecords
}
