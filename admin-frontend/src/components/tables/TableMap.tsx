import { useState } from 'react';
import { Users, Clock, Edit2, X } from 'lucide-react';
import type { Table as TableType } from '../../types';

interface TableMapProps {
  tables: TableType[];
  onTableClick: (table: TableType) => void;
  onStatusChange: (tableId: string, status: string) => void;
}

export function TableMap({ tables, onTableClick, onStatusChange }: TableMapProps) {
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);

  const getTableColor = (status: string) => {
    const colors = {
      available: 'bg-green-400 hover:bg-green-500 border-green-600',
      occupied: 'bg-red-400 hover:bg-red-500 border-red-600',
      reserved: 'bg-blue-400 hover:bg-blue-500 border-blue-600',
      cleaning: 'bg-yellow-400 hover:bg-yellow-500 border-yellow-600',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-400 hover:bg-gray-500 border-gray-600';
  };

  const getTableShape = (capacity: number) => {
    if (capacity <= 2) return 'rounded-full'; // Mesa circular pequeña
    if (capacity <= 4) return 'rounded-full'; // Mesa circular mediana
    return 'rounded-xl'; // Mesa rectangular grande
  };

  const getTableSize = (capacity: number) => {
    if (capacity <= 2) return 'w-20 h-20';
    if (capacity <= 4) return 'w-24 h-24';
    return 'w-32 h-24';
  };

  // Layout grid positions for tables (simulating a restaurant floor plan)
  const getTablePosition = (index: number) => {
    const positions = [
      { row: 1, col: 1 }, // Table 1
      { row: 1, col: 2 }, // Table 2
      { row: 1, col: 3 }, // Table 3
      { row: 2, col: 1 }, // Table 4
      { row: 2, col: 2 }, // Table 5
      { row: 2, col: 3 }, // Table 6
      { row: 3, col: 1 }, // Table 7
      { row: 3, col: 2 }, // Table 8
      { row: 4, col: 1 }, // Table 9
      { row: 4, col: 2 }, // Table 10
      { row: 4, col: 3 }, // Table 11
    ];
    return positions[index] || { row: 1, col: 1 };
  };

  const handleTableClick = (table: TableType) => {
    setSelectedTable(table);
  };

  return (
    <div className="relative">
      {/* Restaurant Floor */}
      <div className="bg-amber-50 rounded-lg shadow-inner p-8 min-h-[600px] border-4 border-amber-200">
        {/* Grid Layout */}
        <div className="grid grid-cols-3 gap-8 auto-rows-min">
          {tables.map((table, index) => {
            const position = getTablePosition(index);
            return (
              <div
                key={table._id}
                style={{
                  gridRow: position.row,
                  gridColumn: position.col,
                }}
                className="flex items-center justify-center"
              >
                {/* Table */}
                <div
                  onClick={() => handleTableClick(table)}
                  className={`
                    ${getTableColor(table.status)}
                    ${getTableShape(table.capacity)}
                    ${getTableSize(table.capacity)}
                    border-4 cursor-pointer
                    shadow-lg transition-all duration-300
                    flex flex-col items-center justify-center
                    relative group
                    hover:scale-110 hover:shadow-2xl
                    animate-pulse-slow
                  `}
                >
                  {/* Table Number */}
                  <div className="text-2xl font-bold text-white drop-shadow-lg">
                    {table.number}
                  </div>
                  
                  {/* Capacity Icon */}
                  <div className="flex items-center text-white text-xs mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    <span>{table.capacity}</span>
                  </div>

                  {/* Occupied Badge */}
                  {table.status === 'occupied' && table.currentOrder && (
                    <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg animate-bounce">
                      !
                    </div>
                  )}

                  {/* Reserved Badge */}
                  {table.status === 'reserved' && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg">
                      <Clock className="w-4 h-4" />
                    </div>
                  )}

                  {/* Hover Info */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    {table.location}
                  </div>

                  {/* Chairs representation */}
                  {Array.from({ length: Math.min(table.capacity, 4) }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute bg-blue-500 w-5 h-6 rounded-t-lg border-2 border-blue-700"
                      style={{
                        transform: `rotate(${i * (360 / Math.min(table.capacity, 4))}deg) translateY(-${
                          getTableSize(table.capacity).includes('20') ? '45' : 
                          getTableSize(table.capacity).includes('24') ? '55' : '65'
                        }px)`,
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table Details Panel */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Table {selectedTable.number}
              </h3>
              <button
                onClick={() => setSelectedTable(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="text-lg font-semibold flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {selectedTable.capacity} people
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="text-lg font-semibold">{selectedTable.location}</p>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="text-sm text-gray-600 block mb-2">Status</label>
                <select
                  value={selectedTable.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as 'available' | 'occupied' | 'reserved' | 'cleaning';
                    onStatusChange(selectedTable._id, newStatus);
                    setSelectedTable({ ...selectedTable, status: newStatus });
                  }}
                  className={`w-full px-4 py-2 rounded-lg border-2 font-semibold ${getTableColor(
                    selectedTable.status
                  )}`}
                >
                  <option value="available">✓ Available</option>
                  <option value="occupied">● Occupied</option>
                  <option value="reserved">⏰ Reserved</option>
                  <option value="cleaning">🧹 Cleaning</option>
                </select>
              </div>

              {/* Order Info */}
              {selectedTable.currentOrder && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Current Order</p>
                  <p className="text-lg font-semibold">Order #{selectedTable.currentOrder}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => {
                    onTableClick(selectedTable);
                    setSelectedTable(null);
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Table
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Status Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-400 border-2 border-green-600 rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-400 border-2 border-red-600 rounded"></div>
            <span className="text-sm">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-400 border-2 border-blue-600 rounded"></div>
            <span className="text-sm">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 border-2 border-yellow-600 rounded"></div>
            <span className="text-sm">Cleaning</span>
          </div>
        </div>
      </div>
    </div>
  );
}
