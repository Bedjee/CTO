import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function MonthlySummary({ summary, selectedMonth, availableMonths }) {
    const [month, setMonth] = useState(selectedMonth);

    const applyMonth = () => {
        router.get(route('reports.monthly-summary'), { month });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Monthly CTO Summary</h2>}>
            <Head title="Monthly Summary" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex gap-2 items-center">
                                    <select
                                        value={month}
                                        onChange={e => setMonth(e.target.value)}
                                        className="border-gray-300 rounded-md shadow-sm"
                                    >
                                        {availableMonths.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={applyMonth}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        View Report
                                    </button>
                                </div>
                                <button
                                    onClick={handlePrint}
                                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                                >
                                    🖨️ Print
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Department</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Total Hours Earned</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Total Hours Used</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Net Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {summary.map((dept, idx) => (
                                            <tr key={idx}>
                                                <td className="px-6 py-4 text-sm font-medium">{dept.department}</td>
                                                <td className="px-6 py-4 text-right text-green-600">{dept.total_earned}</td>
                                                <td className="px-6 py-4 text-right text-red-600">{dept.total_used}</td>
                                                <td className={`px-6 py-4 text-right font-semibold ${dept.balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                    {dept.balance}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-100 font-bold">
                                        <tr>
                                            <td className="px-6 py-3 text-left">Grand Total</td>
                                            <td className="px-6 py-3 text-right">
                                                {summary.reduce((sum, d) => sum + d.total_earned, 0)}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                {summary.reduce((sum, d) => sum + d.total_used, 0)}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                {summary.reduce((sum, d) => sum + d.balance, 0)}
                                            </td>
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
                    nav, aside, .bg-gray-600, button, .flex.justify-between.mb-6, .py-12 {
                        display: none !important;
                    }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
