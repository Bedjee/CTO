import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

export default function DepartmentSummary({ departments }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Department CTO Summary</h2>}>
            <Head title="Department Summary" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={handlePrint}
                                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                                >
                                    🖨️ Print Report
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Department</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Total Employees</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Total Earned</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Total Used</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Net Balance</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {departments.map((dept, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm font-medium">{dept.department}</td>
                                                <td className="px-6 py-4 text-right text-sm">{dept.total_employees}</td>
                                                <td className="px-6 py-4 text-right text-green-600">{dept.total_earned}</td>
                                                <td className="px-6 py-4 text-right text-red-600">{dept.total_used}</td>
                                                <td className={`px-6 py-4 text-right font-semibold ${dept.balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                    {dept.balance}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link
                                                        href={route('reports.monthly-summary')}
                                                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                    >
                                                        View Monthly
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-100 font-bold">
                                        <tr>
                                            <td className="px-6 py-3 text-left">Grand Total</td>
                                            <td className="px-6 py-3 text-right">
                                                {departments.reduce((sum, d) => sum + d.total_employees, 0)}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                {departments.reduce((sum, d) => sum + d.total_earned, 0)}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                {departments.reduce((sum, d) => sum + d.total_used, 0)}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                {departments.reduce((sum, d) => sum + d.balance, 0)}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    nav, aside, .bg-gray-600, button, .flex.justify-end.mb-4, .py-12 {
                        display: none !important;
                    }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
