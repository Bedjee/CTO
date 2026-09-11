import React, { useState, useRef, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';

export default function CtoCreditsIndex({ credits, employees, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [editingCredit, setEditingCredit] = useState(null);

    const { data, setData, post, put, reset, errors } = useForm({
        employee_id: '',
        employee_ids: [],
        activity: '',
        overtime_dates_rendered: '',
        hours_earned: '',
        remarks: ''
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const employeeOptions = employees.map(emp => ({
        value: emp.id,
        label: `${emp.full_name} (ID: ${emp.id})`
    }));

    const filteredOptions = employeeOptions.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedIds = Array.isArray(data.employee_ids) ? data.employee_ids : [];

    useEffect(() => {
        console.log('Selected employee IDs:', selectedIds);
    }, [selectedIds]);

    const toggleEmployee = (empId) => {
        console.log('Toggling employee:', empId);
        const current = Array.isArray(data.employee_ids) ? data.employee_ids : [];
        const newIds = current.includes(empId)
            ? current.filter(id => id !== empId)
            : [...current, empId];
        console.log('New IDs:', newIds);
        setData('employee_ids', newIds);
    };

    const removeEmployee = (empId) => {
        const current = Array.isArray(data.employee_ids) ? data.employee_ids : [];
        const newIds = current.filter(id => id !== empId);
        setData('employee_ids', newIds);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const openModal = (credit = null) => {
        if (credit) {
            setEditingCredit(credit);
            setData({
                employee_id: credit.employee_id,
                employee_ids: [],
                activity: credit.activity,
                overtime_dates_rendered: credit.overtime_dates_rendered,
                hours_earned: credit.hours_earned,
                remarks: credit.remarks || ''
            });
        } else {
            setEditingCredit(null);
            reset();
            setData('employee_ids', []);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCredit(null);
        reset();
        setData('employee_ids', []);
        setSearchTerm('');
        setIsDropdownOpen(false);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingCredit) {
            put(route('cto-credits.update', editingCredit.id), {
                onSuccess: () => closeModal(),
                onError: (errors) => console.error('Update failed:', errors)
            });
        } else {
            post(route('cto-credits.store'), {
                onSuccess: () => closeModal(),
                onError: (errors) => console.error('Store failed:', errors)
            });
        }
    };

    const deleteCredit = (credit) => {
        if (confirm(`Delete CTO credit for ${credit.employee?.full_name}?`)) {
            router.delete(route('cto-credits.destroy', credit.id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">CTO Credits (Overtime)</h2>}>
            <Head title="CTO Credits" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                                <input
                                    type="text"
                                    placeholder="Search by employee..."
                                    className="border-gray-300 rounded-md shadow-sm px-3 py-1.5 text-sm"
                                    defaultValue={filters.search}
                                    onKeyUp={(e) => {
                                        if (e.key === 'Enter') {
                                            router.get(route('cto-credits.index'), { search: e.target.value });
                                        }
                                    }}
                                />
                                <PrimaryButton onClick={() => openModal()} className="text-sm py-1.5 px-4">
                                    Add Credit
                                </PrimaryButton>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                            <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                                            <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime Dates</th>
                                            <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                            <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                                            <th className="px-3 py-1.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {credits.data.map(credit => (
                                            <tr key={credit.id}>
                                                <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-900">
                                                    {credit.employee?.full_name}
                                                </td>
                                                <td className="px-3 py-1.5 text-sm text-gray-900">{credit.activity}</td>
                                                <td className="px-3 py-1.5 text-sm text-gray-900">{credit.overtime_dates_rendered}</td>
                                                <td className="px-3 py-1.5 whitespace-nowrap text-sm font-semibold text-green-600">
                                                    {credit.hours_earned}
                                                </td>
                                                <td className="px-3 py-1.5 text-sm text-gray-500">{credit.remarks || '-'}</td>
                                                <td className="px-3 py-1.5 whitespace-nowrap text-right text-sm font-medium space-x-1.5">
                                                    <button
                                                        onClick={() => openModal(credit)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <DangerButton
                                                        onClick={() => deleteCredit(credit)}
                                                        className="text-xs py-0.5 px-2"
                                                    >
                                                        Delete
                                                    </DangerButton>
                                                </td>
                                            </tr>
                                        ))}
                                        {credits.data.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-3 py-4 text-center text-gray-500">
                                                    No CTO credits found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {credits.links && (
                                <div className="mt-3 flex justify-center space-x-1">
                                    {credits.links.map((link, i) => (
                                        <button
                                            key={i}
                                            onClick={() => router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-2 py-0.5 rounded text-sm ${
                                                link.active ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium mb-4">
                        {editingCredit ? 'Edit CTO Credit' : 'Add CTO Credit (Bulk)'}
                    </h2>
                    <div className="space-y-4">
                        {editingCredit ? (
                            <div>
                                <InputLabel value="Employee" />
                                <div className="mt-1 text-sm text-gray-700">
                                    {employees.find(e => e.id === data.employee_id)?.full_name || '—'}
                                </div>
                            </div>
                        ) : (
                            <div ref={dropdownRef} className="relative">
                                <InputLabel value="Employees (select multiple)" />
                                <div
                                    className="mt-1 w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 cursor-pointer bg-white"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    {selectedIds.length === 0 ? (
                                        <span className="text-gray-400 text-sm">Click to select employees...</span>
                                    ) : (
                                        <div className="flex flex-wrap gap-1">
                                            {selectedIds.map(id => {
                                                const emp = employees.find(e => e.id === id);
                                                return emp ? (
                                                    <span key={id} className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                                        {emp.full_name}
                                                        <button
                                                            type="button"
                                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                                            onClick={(e) => { e.stopPropagation(); removeEmployee(id); }}
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    )}
                                </div>

                                {isDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                        <div className="sticky top-0 bg-white p-2 border-b">
                                            <input
                                                type="text"
                                                placeholder="Search employees..."
                                                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-1.5 text-sm"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <ul className="divide-y divide-gray-100">
                                            {filteredOptions.length === 0 ? (
                                                <li className="px-3 py-2 text-sm text-gray-500">No employees found</li>
                                            ) : (
                                                filteredOptions.map(opt => (
                                                    <li
                                                        key={opt.value}
                                                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleEmployee(opt.value);
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="mr-2"
                                                            checked={selectedIds.includes(opt.value)}
                                                            onChange={() => toggleEmployee(opt.value)}
                                                        />
                                                        <span className="text-sm">{opt.label}</span>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                )}
                                {errors.employee_ids && (
                                    <div className="text-red-500 text-sm mt-1">{errors.employee_ids}</div>
                                )}
                                {!editingCredit && selectedIds.length === 0 && errors.employee_id && (
                                    <div className="text-red-500 text-sm mt-1">{errors.employee_id}</div>
                                )}
                            </div>
                        )}

                        <div>
                            <InputLabel value="Activity/Event" />
                            <TextInput
                                className="mt-1 w-full"
                                value={data.activity}
                                onChange={e => setData('activity', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <InputLabel value="Overtime Dates Rendered" />
                            <TextInput
                                className="mt-1 w-full"
                                value={data.overtime_dates_rendered}
                                onChange={e => setData('overtime_dates_rendered', e.target.value)}
                                required
                                placeholder="e.g., May 20-25, 2026"
                            />
                        </div>
                        <div>
                            <InputLabel value="Hours Earned" />
                            <TextInput
                                type="number"
                                step="0.01"
                                className="mt-1 w-full"
                                value={data.hours_earned}
                                onChange={e => setData('hours_earned', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <InputLabel value="Remarks (Optional)" />
                            <TextInput
                                className="mt-1 w-full"
                                value={data.remarks}
                                onChange={e => setData('remarks', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <PrimaryButton type="submit">Save</PrimaryButton>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
