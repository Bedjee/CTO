import React from 'react'; // 👈 FIX: explicitly import React
import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';

export default function EmployeesIndex({ employees, departments, filters }) {
    // ---------- Employee CRUD ----------
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const { data, setData, post, put, reset, errors } = useForm({
        full_name: '',
        department_id: '',
        employment_status: ''
    });

    // ---------- Balance Adjustment ----------
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [adjustingEmployee, setAdjustingEmployee] = useState(null);
    const { data: adjData, setData: setAdjData, post: adjPost, reset: adjReset, errors: adjErrors } = useForm({
        employee_id: '',
        adjustment_hours: '',
        reason: '',
    });

    // Employee CRUD handlers
    const openModal = (employee = null) => {
        if (employee) {
            setEditingEmployee(employee);
            setData({
                full_name: employee.full_name,
                department_id: employee.department_id,
                employment_status: employee.employment_status
            });
        } else {
            setEditingEmployee(null);
            reset();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
        setEditingEmployee(null);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingEmployee) {
            put(route('employees.update', editingEmployee.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('employees.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const deleteEmployee = (employee) => {
        if (confirm('Delete this employee? All associated CTO records will be deleted.')) {
            router.delete(route('employees.destroy', employee.id));
        }
    };

    // Adjustment handlers
    const openAdjustModal = (employee) => {
        setAdjustingEmployee(employee);
        adjReset();
        setAdjData({ employee_id: employee.id, adjustment_hours: '', reason: '' });
        setShowAdjustModal(true);
    };

    const closeAdjustModal = () => {
        setShowAdjustModal(false);
        setAdjustingEmployee(null);
        adjReset();
    };

    const submitAdjustment = (e) => {
        e.preventDefault();
        adjPost(route('cto-adjustments.store'), {
            onSuccess: () => closeAdjustModal()
        });
    };

    // ---------- Group employees by department ----------
    const groupedEmployees = employees.data.reduce((acc, emp) => {
        const deptId = emp.department_id || 'unassigned';
        const deptName = emp.department?.name || 'Unassigned';
        if (!acc[deptId]) {
            acc[deptId] = { id: deptId, name: deptName, employees: [] };
        }
        acc[deptId].employees.push(emp);
        return acc;
    }, {});

    const departmentGroups = Object.values(groupedEmployees).sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Employee Management</h2>}>
            <Head title="Employees" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4">
                            {/* Search & Add Button */}
                            <div className="flex justify-between items-center mb-3">
                                <input
                                    type="text"
                                    placeholder="Search by name or department..."
                                    className="border-gray-300 rounded-md shadow-sm px-3 py-1.5 text-sm"
                                    defaultValue={filters.search}
                                    onKeyUp={(e) => {
                                        if (e.key === 'Enter') {
                                            router.get(route('employees.index'), { search: e.target.value });
                                        }
                                    }}
                                />
                                <PrimaryButton onClick={() => openModal()} className="text-sm py-1.5 px-4">
                                    Add Employee
                                </PrimaryButton>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead>
                                        <tr>
                                            <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                            <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employment Status</th>
                                            <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                                            <th className="px-3 py-1.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {departmentGroups.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-3 py-4 text-center text-gray-500">
                                                    No employees found.
                                                </td>
                                            </tr>
                                        ) : (
                                            departmentGroups.map((group) => (
                                                <React.Fragment key={group.id}>
                                                    {/* Department header row */}
                                                    <tr className="bg-gray-50">
                                                        <td colSpan="5" className="px-3 py-1.5 font-semibold text-gray-700">
                                                            {group.name}
                                                            <span className="ml-2 text-xs font-normal text-gray-400">
                                                                ({group.employees.length})
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    {/* Employee rows */}
                                                    {group.employees.map((emp) => (
                                                        <tr key={emp.id}>
                                                            <td className="px-3 py-1.5 whitespace-nowrap text-xs">{emp.id}</td>
                                                            <td className="px-3 py-1.5 whitespace-nowrap font-medium text-sm">{emp.full_name}</td>
                                                            <td className="px-3 py-1.5 whitespace-nowrap text-sm">{emp.employment_status}</td>
                                                            <td className="px-3 py-1.5 whitespace-nowrap font-bold text-sm">{emp.balance}</td>
                                                            <td className="px-3 py-1.5 whitespace-nowrap text-right space-x-1.5">
                                                                <button onClick={() => openModal(emp)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                                                                <button onClick={() => openAdjustModal(emp)} className="text-yellow-600 hover:text-yellow-800 text-sm">Adjust</button>
                                                                <DangerButton onClick={() => deleteEmployee(emp)} className="text-xs py-0.5 px-2">Delete</DangerButton>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {employees.links && (
                                <div className="mt-3 flex justify-center space-x-1">
                                    {employees.links.map((link, i) => (
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

            {/* Add/Edit Employee Modal */}
            <Modal show={showModal} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="p-4">
                    <h2 className="text-lg font-medium mb-3">{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
                    <div className="space-y-3">
                        <div>
                            <InputLabel value="Full Name" />
                            <TextInput
                                className="mt-1 w-full"
                                value={data.full_name}
                                onChange={e => setData('full_name', e.target.value)}
                                required
                            />
                            {errors.full_name && <div className="text-red-500 text-xs mt-1">{errors.full_name}</div>}
                        </div>
                        <div>
                            <InputLabel value="Department" />
                            <select
                                className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                                value={data.department_id}
                                onChange={e => setData('department_id', e.target.value)}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                            {errors.department_id && <div className="text-red-500 text-xs mt-1">{errors.department_id}</div>}
                        </div>
                        <div>
                            <InputLabel value="Employment Status" />
                            <select
                                className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                                value={data.employment_status}
                                onChange={e => setData('employment_status', e.target.value)}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="Job Order">Job Order</option>
                                <option value="Regular">Regular</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <PrimaryButton type="submit">Save</PrimaryButton>
                        <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-3 py-1.5 rounded text-sm">Cancel</button>
                    </div>
                </form>
            </Modal>

            {/* Balance Adjustment Modal */}
            <Modal show={showAdjustModal} onClose={closeAdjustModal} maxWidth="md">
                <form onSubmit={submitAdjustment} className="p-4">
                    <h2 className="text-lg font-medium mb-3">Adjust Balance: {adjustingEmployee?.full_name}</h2>
                    <div className="space-y-3">
                        <div>
                            <InputLabel value="Adjustment Hours" />
                            <TextInput
                                type="number"
                                step="0.01"
                                className="mt-1 w-full"
                                value={adjData.adjustment_hours}
                                onChange={e => setAdjData('adjustment_hours', e.target.value)}
                                required
                                placeholder="e.g., +5 or -3.5"
                            />
                            <p className="text-xs text-gray-500 mt-1">Positive = Add, Negative = Subtract</p>
                            {adjErrors.adjustment_hours && <div className="text-red-500 text-xs mt-1">{adjErrors.adjustment_hours}</div>}
                        </div>
                        <div>
                            <InputLabel value="Reason" />
                            <textarea
                                className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                                rows="3"
                                value={adjData.reason}
                                onChange={e => setAdjData('reason', e.target.value)}
                                required
                                placeholder="Explain why this adjustment is needed"
                            />
                            {adjErrors.reason && <div className="text-red-500 text-xs mt-1">{adjErrors.reason}</div>}
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <PrimaryButton type="submit">Apply Adjustment</PrimaryButton>
                        <button type="button" onClick={closeAdjustModal} className="bg-gray-500 text-white px-3 py-1.5 rounded text-sm">Cancel</button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
