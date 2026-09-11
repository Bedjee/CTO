import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function EmployeeLedger({ employee, transactions, totalEarned, totalUsed, currentBalance }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800">
                        Employee Ledger: {employee.full_name}
                    </h2>
                    <div className="space-x-2">
                        <button
                            onClick={handlePrint}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                        >
                            🖨️ Print
                        </button>
                        <Link href={route('reports.department-summary')} className="text-indigo-600 hover:text-indigo-900">
                            ← Back
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Ledger - ${employee.full_name}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded border">
                                    <div className="text-gray-500 text-sm">Department</div>
                                    <div className="text-lg font-semibold">{employee.department?.name || '-'}</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded border">
                                    <div className="text-gray-500 text-sm">Total Earned</div>
                                    <div className="text-2xl font-bold text-green-600">{totalEarned}</div>
                                </div>
                                <div className="bg-red-50 p-4 rounded border">
                                    <div className="text-gray-500 text-sm">Total Used</div>
                                    <div className="text-2xl font-bold text-red-600">{totalUsed}</div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded border">
                                    <div className="text-gray-500 text-sm">Current Balance</div>
                                    <div className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                        {currentBalance}
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Description</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Details</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Hours</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Running Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {transactions.map((t, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-3 text-sm">{t.date}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                        t.type === 'CREDITED' ? 'bg-green-100 text-green-800' :
                                                        t.type === 'USED' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {t.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">{t.description}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500">{t.details || '-'}</td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold">
                                                    {t.type === 'CREDITED' ? `+${t.hours}` :
                                                     t.type === 'USED' ? t.hours :
                                                     t.hours > 0 ? `+${t.hours}` : t.hours}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-bold">{t.running_balance}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    nav, aside, .sm\\:hidden, .bg-gray-600, .text-indigo-600, .py-12, .shadow-sm, .sm\\:rounded-lg {
                        display: none !important;
                    }
                    body { background: white; }
                    .bg-white { box-shadow: none; }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
