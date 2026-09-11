import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { XMarkIcon } from '@heroicons/react/20/solid';
import 'react-datepicker/dist/react-datepicker.css';

export default function DateSelectorWithHalfDays({ value, onChange, onHoursChange }) {
    const [selectedDates, setSelectedDates] = useState([]);
    const isInternalUpdate = useRef(false); // Prevent re-parsing on own updates

    // Only parse initial value (or when value changes externally)
    useEffect(() => {
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }

        if (value && typeof value === 'string' && value.trim() !== '') {
            const parts = value.split(',').map(part => part.trim());
            const parsed = [];
            for (const part of parts) {
                const match = part.match(/^(.*?)\s*\((\w+)(?::(\d+(?:\.\d+)?))?\)$/);
                if (match) {
                    let dateStr = match[1];
                    const type = match[2].toLowerCase();
                    const customHours = match[3] ? parseFloat(match[3]) : null;
                    // Robust date parsing: try to parse as Date
                    let date = new Date(dateStr);
                    if (isNaN(date.getTime())) {
                        // Fallback: try to parse with a known format
                        date = new Date(dateStr.replace(/(\w+)\s(\d+),\s(\d+)/, '$2 $1 $3'));
                    }
                    if (!isNaN(date.getTime()) && ['full', 'am', 'pm', 'other'].includes(type)) {
                        parsed.push({ date, type, customHours });
                    }
                }
            }
            if (parsed.length) setSelectedDates(parsed);
        }
    }, [value]); // Only runs when external value changes

    const getHoursForItem = (item) => {
        if (item.type === 'full') return 10;
        if (item.type === 'am' || item.type === 'pm') return 5;
        if (item.type === 'other' && item.customHours) return item.customHours;
        return 0;
    };

    const calculateTotalHours = (dates) => {
        return dates.reduce((total, item) => total + getHoursForItem(item), 0);
    };

    const updateParent = (newDates) => {
        isInternalUpdate.current = true; // Mark this update as internal
        setSelectedDates(newDates);
        const formatted = newDates.map(item => {
            const dateStr = item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            let typeLabel = '';
            let suffix = '';
            if (item.type === 'full') typeLabel = 'Full';
            else if (item.type === 'am') typeLabel = 'AM';
            else if (item.type === 'pm') typeLabel = 'PM';
            else if (item.type === 'other') {
                typeLabel = 'Other';
                if (item.customHours) suffix = `:${item.customHours}`;
            }
            return `${dateStr} (${typeLabel}${suffix})`;
        }).join(', ');
        onChange(formatted);
        onHoursChange(calculateTotalHours(newDates));
    };

    const addDate = (date) => {
        if (selectedDates.some(d => d.date.toDateString() === date.toDateString())) return;
        updateParent([...selectedDates, { date, type: 'full', customHours: null }]);
    };

    const removeDate = (index) => {
        updateParent(selectedDates.filter((_, i) => i !== index));
    };

    const updateType = (index, newType) => {
        const newDates = [...selectedDates];
        newDates[index].type = newType;
        if (newType !== 'other') {
            newDates[index].customHours = null;
        } else if (!newDates[index].customHours) {
            newDates[index].customHours = 5;
        }
        updateParent(newDates);
    };

    const updateCustomHours = (index, hours) => {
        const newDates = [...selectedDates];
        newDates[index].customHours = parseFloat(hours) || 0;
        updateParent(newDates);
    };

    return (
        <div className="space-y-2">
            {/* Calendar with constrained width */}
            <div className="max-w-sm">
                <DatePicker
                    selected={null}
                    onChange={addDate}
                    inline
                    className="w-full text-sm border rounded"
                />
            </div>

            {selectedDates.length > 0 && (
                <div className="mt-2 border rounded-md bg-gray-50 p-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Selected Dates:</p>
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                        {selectedDates.map((item, idx) => (
                            <div key={idx} className="flex flex-wrap items-center gap-1 border-b border-gray-200 pb-1 last:border-0 text-sm">
                                <div className="w-24 text-sm font-medium text-gray-800">
                                    {item.date.toLocaleDateString()}
                                </div>
                                <select
                                    value={item.type}
                                    onChange={(e) => updateType(idx, e.target.value)}
                                    className="border rounded px-1 py-0.5 text-xs bg-white"
                                >
                                    <option value="full">Full (10h)</option>
                                    <option value="am">AM (5h)</option>
                                    <option value="pm">PM (5h)</option>
                                    <option value="other">Other</option>
                                </select>
                                {item.type === 'other' && (
                                    <div className="flex items-center gap-0.5">
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={item.customHours || ''}
                                            onChange={(e) => updateCustomHours(idx, e.target.value)}
                                            placeholder="Hrs"
                                            className="w-14 border rounded px-1 py-0.5 text-xs"
                                        />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeDate(idx)}
                                    className="ml-auto text-red-500 hover:text-red-700"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-1 pt-1 border-t border-gray-200 text-xs font-semibold text-gray-800">
                        Total Hours: <span className="text-indigo-600">{calculateTotalHours(selectedDates)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
