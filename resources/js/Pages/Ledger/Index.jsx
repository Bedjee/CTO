import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function LedgerIndex({ employees, departments, filters }) {
    const [departmentFilter, setDepartmentFilter] = useState(filters.department_id || '');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const applyFilters = () => {
        router.get(route('ledger.index'), {
            department_id: departmentFilter,
            search: searchTerm,
            page: 1
        });
    };

   const openPrintWindow = () => {
    window.open(route('ledger.print'), '_blank');
};

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">CTO Ledger Summary</h2>}>
            <Head title="CTO Ledger" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">

                            <div className="flex justify-between items-center mb-4 print:hidden">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
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
                                        placeholder="Search by name or department..."
                                        className="border-gray-300 rounded-md shadow-sm"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                    <button onClick={applyFilters} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                        Apply Filters
                                    </button>
                                </div>
                               <button
    onClick={openPrintWindow}
    className="ml-2 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 print:hidden"
>
    📄 Print Full Report (All Employees)
</button>
                            </div>

                            {/* Employee Summary Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Earned</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Used</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Balance</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase print:hidden">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {employees.data.map(emp => (
                                            <tr key={emp.id}>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{emp.full_name}</div>
                                                    <div className="text-sm text-gray-500">ID: {emp.id}</div>
                                                </td>
                                                <td className="px-6 py-4">{emp.department?.name || '-'}</td>
                                                <td className="px-6 py-4 text-green-600 font-semibold">{emp.total_earned}</td>
                                                <td className="px-6 py-4 text-red-600 font-semibold">{emp.total_used}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-bold ${emp.current_balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                        {emp.current_balance}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 print:hidden">
                                                    <Link
                                                        href={route('ledger.show', emp.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                    >
                                                        View Ledger →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination (hidden in print) */}
                            {employees.links && (
                                <div className="mt-4 flex justify-center space-x-2 print:hidden">
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
