// src/components/tables/DataTable.jsx
import React from "react";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";

const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onSort,
  sortConfig = [],
  selectable = false,
  selectedRows = [],
  toggleSelectRow,
  toggleSelectAll,
}) => {
  const getSortDirection = (key) => {
    const sort = sortConfig.find((s) => s.key === key);
    return sort ? sort.direction : null;
  };

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      {/* Desktop/Table view */}
      <table className="min-w-full divide-y divide-gray-200 hidden md:table">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            {selectable && (
              <th className="px-4 py-2 bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedRows.length > 0 && selectedRows.length === data.length}
                  onChange={toggleSelectAll}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer select-none bg-gray-50"
                onClick={(e) => onSort && onSort(col.key, e.shiftKey)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {(() => {
                    const direction = getSortDirection(col.key);
                    if (direction === "asc") return <FaSortUp className="text-gray-500" />;
                    if (direction === "desc") return <FaSortDown className="text-gray-500" />;
                    return onSort ? <FaSort className="text-gray-300" /> : null;
                  })()}
                </div>
              </th>
            ))}
            {(onEdit || onDelete) && <th className="px-4 py-2 bg-gray-50">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={
                  columns.length + 
                  (selectable ? 1 : 0) + 
                  (onEdit || onDelete ? 1 : 0)
                }
                className="text-center py-4 text-gray-500"
              >
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-50 transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {selectable && (
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleSelectRow(row.id)}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-sm text-gray-700">
                    {row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-2 flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row.id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Mobile/Card view */}
      <div className="flex flex-col gap-4 md:hidden p-2">
        {data.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No records found</div>
        ) : (
          data.map((row) => (
            <div
              key={row.id}
              className="bg-white rounded shadow p-4 flex flex-col gap-2 hover:bg-gray-50 transition-colors duration-200"
            >
              {selectable && (
                <div>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => toggleSelectRow(row.id)}
                  />{" "}
                  Select
                </div>
              )}
              {columns.map((col) => (
                <div key={col.key} className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{col.header}</span>
                  <span className="text-gray-600">{row[col.key]}</span>
                </div>
              ))}
              {(onEdit || onDelete) && (
                <div className="flex gap-2 mt-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row.id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DataTable;
