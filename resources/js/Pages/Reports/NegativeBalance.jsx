import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function NegativeBalance({ employees, departments }) {
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const applyFilters = () => {
        router.get(route('negative.balance'), {
            department_id: departmentFilter,
            search: searchTerm,
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800">Employees with Negative CTO Balance</h2>}
        >
            <Head title="Negative Balance Report" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <select
                                    value={departmentFilter}
                                    onChange={e => setDepartmentFilter(e.target.value)}
                                    className="border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">All Departments</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="border-gray-300 rounded-md shadow-sm"
                                />
                                <button
                                    onClick={applyFilters}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Apply Filters
                                </button>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employment Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance (Negative)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {employees.data.map(emp => (
                                            <tr key={emp.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-900">{emp.id}</td>
                                                <td className="px-6 py-4 font-medium text-gray-900">{emp.full_name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{emp.department?.name || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{emp.employment_status}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-red-600">{emp.balance}</td> {/* balance is negative */}
                                            </tr>
                                        ))}
                                        {employees.data.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                    No employees with negative balance found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {employees.links && (
                                <div className="mt-4 flex justify-center space-x-2">
                                    {employees.links.map((link, i) => (
                                        <button
                                            key={i}
                                            onClick={() => router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1 rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
