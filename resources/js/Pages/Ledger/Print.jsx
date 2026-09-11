import { Head } from '@inertiajs/react';

export default function PrintLedger({ grouped }) {
    let overallTotalEarned = 0;
    let overallTotalUsed = 0;
    let overallTotalBalance = 0;

    return (
        <>
            <Head title="CTO Ledger - Print" />
            <div className="p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold mb-2">CTO Ledger Summary</h1>
                    <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
                    <p className="text-gray-600">All employees grouped by department</p>
                </div>

                {Object.entries(grouped).map(([department, employees]) => {
                    let deptTotalEarned = 0;
                    let deptTotalUsed = 0;
                    let deptTotalBalance = 0;

                    employees.forEach(emp => {
                        deptTotalEarned += parseFloat(emp.total_earned) || 0;
                        deptTotalUsed += parseFloat(emp.total_used) || 0;
                        deptTotalBalance += parseFloat(emp.current_balance) || 0;
                    });

                    overallTotalEarned += deptTotalEarned;
                    overallTotalUsed += deptTotalUsed;
                    overallTotalBalance += deptTotalBalance;

                    return (
                        <div key={department} className="mb-8">
                            <div className="bg-gray-100 p-3 font-bold text-lg border-b-2 border-gray-400 mb-2 print:bg-gray-200">
                                {department}
                                <span className="float-right text-sm font-normal">
                                    Department Total Balance: {deptTotalBalance.toFixed(2)}
                                </span>
                            </div>
                            <table className="w-full border-collapse mb-4">
                                <thead>
                                    <tr className="border-b-2 border-gray-300 bg-gray-50">
                                        <th className="text-left p-2">Employee Name</th>

                                        <th className="text-right p-2">Total Earned</th>
                                        <th className="text-right p-2">Total Used</th>
                                        <th className="text-right p-2">Current Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map(emp => (
                                        <tr key={emp.id} className="border-b border-gray-200">
                                            <td className="p-2">{emp.full_name}</td>

                                            <td className="text-right p-2">{parseFloat(emp.total_earned).toFixed(2)}</td>
                                            <td className="text-right p-2">{parseFloat(emp.total_used).toFixed(2)}</td>
                                            <td className={`text-right p-2 font-semibold ${emp.current_balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {parseFloat(emp.current_balance).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                                        <td colSpan="2" className="p-2">Department Totals</td>
                                        <td className="text-right p-2">{deptTotalEarned.toFixed(2)}</td>
                                        <td className="text-right p-2">{deptTotalUsed.toFixed(2)}</td>
                                        <td className="text-right p-2">{deptTotalBalance.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                })}

                <div className="mt-8 pt-4 border-t-2 border-gray-400 text-right font-bold text-lg">
                    <p>Grand Total Earned: {overallTotalEarned.toFixed(2)}</p>
                    <p>Grand Total Used: {overallTotalUsed.toFixed(2)}</p>
                    <p>Grand Total Balance: {overallTotalBalance.toFixed(2)}</p>
                </div>

                <div className="text-center text-gray-500 text-sm mt-8">
                    This report includes all CTO adjustments.
                </div>
            </div>
        </>
    );
}
