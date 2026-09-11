import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function LedgerShow({ employee, transactions, totalEarned, totalUsed, currentBalance }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800">
                        CTO Ledger: {employee.full_name}
                    </h2>
                    <Link href={route('ledger.index')} className="text-indigo-600 hover:text-indigo-900">
                        ← Back to Summary
                    </Link>
                </div>
            }
        >
            <Head title={`Ledger - ${employee.full_name}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white shadow-sm rounded-lg p-4 border">
                            <div className="text-gray-500 text-sm">Total Hours Earned</div>
                            <div className="text-2xl font-bold text-green-600">{totalEarned}</div>
                        </div>
                        <div className="bg-white shadow-sm rounded-lg p-4 border">
                            <div className="text-gray-500 text-sm">Total Hours Used</div>
                            <div className="text-2xl font-bold text-red-600">{totalUsed}</div>
                        </div>
                        <div className="bg-white shadow-sm rounded-lg p-4 border">
                            <div className="text-gray-500 text-sm">Current Balance</div>
                            <div className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                {currentBalance}
                            </div>
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="font-semibold text-lg mb-4">Transaction History</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity / Purpose</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Running Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {transactions.map((t, idx) => (
                                            <tr key={idx}>
                                                <td className="px-6 py-4 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    {t.type === 'CREDITED' && (
                                                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">CREDITED</span>
                                                    )}
                                                    {t.type === 'USED' && (
                                                        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">USED</span>
                                                    )}
                                                    {t.type === 'ADJUSTMENT' && (
                                                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">ADJUSTMENT</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm">{t.activity}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {t.type === 'ADJUSTMENT' ? (
                                                        <span title={t.remarks}>{t.details}</span>
                                                    ) : (
                                                        t.details || '-'
                                                    )}
                                                </td>
                                                <td className={`px-6 py-4 text-sm font-semibold ${
                                                    t.type === 'CREDITED' ? 'text-green-600' :
                                                    t.type === 'USED' ? 'text-red-600' :
                                                    'text-blue-600'
                                                }`}>
                                                    {t.type === 'CREDITED' ? `+${t.hours}` :
                                                     t.type === 'USED' ? t.hours :
                                                     t.hours > 0 ? `+${t.hours}` : t.hours}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold">{t.running_balance}</td>
                                            </tr>
                                        ))}
                                        {transactions.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                    No CTO transactions recorded for this employee.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
