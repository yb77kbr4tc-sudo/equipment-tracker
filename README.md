# Equipment Tracker

A modern web app for construction companies to track tools and equipment inventory, maintenance schedules, and allocation.

## Features

✅ **Equipment Inventory** - Add, edit, and delete equipment with detailed information
✅ **Status Tracking** - Track status: Available, Assigned, Maintenance, Broken, Retired
✅ **Project Assignment** - Assign equipment to specific projects/sites
✅ **Condition Monitoring** - Track equipment condition: Excellent, Good, Fair, Poor
✅ **Maintenance Schedule** - Set and track maintenance due dates
✅ **Dashboard** - Quick stats on total equipment, available, assigned, and maintenance needed
✅ **Search & Filter** - Find equipment quickly by name, serial number, or project
✅ **Data Persistence** - All data saved to browser localStorage
✅ **Responsive Design** - Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yb77kbr4tc-sudo/equipment-tracker.git
cd equipment-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## Usage

1. **Add Equipment** - Click the "Add Equipment" button and fill in the form
2. **View Equipment** - Browse all equipment in the list
3. **Filter** - Use status filters and search to find specific items
4. **Edit** - Click Edit on any item to modify its details
5. **Delete** - Click Delete to remove equipment (with confirmation)

## Equipment Fields

- **Name** - Equipment name (required)
- **Category** - Type of equipment (Tools, Heavy Equipment, Safety, Vehicles, etc.)
- **Serial Number** - Unique identifier (required)
- **Status** - Available, Assigned, Maintenance, Broken, or Retired
- **Project/Site** - Where the equipment is deployed
- **Condition** - Excellent, Good, Fair, or Poor
- **Quantity** - Number of units
- **Purchase Date** - When acquired
- **Maintenance Date** - When next maintenance is due
- **Notes** - Any additional information

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon library
- **localStorage** - Data persistence

## Future Enhancements

- [ ] Backend database integration (PostgreSQL/MongoDB)
- [ ] User authentication and multi-site support
- [ ] Equipment check-in/check-out workflow
- [ ] Maintenance reminder notifications
- [ ] Export reports (PDF/Excel)
- [ ] QR code scanning for quick access
- [ ] Equipment photos and documentation
- [ ] Maintenance history log
- [ ] Cost tracking and analytics
- [ ] Mobile app (React Native)

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
