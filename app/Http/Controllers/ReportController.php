<?php
namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\CtoCredit;
use App\Models\CtoUsage;
use App\Models\CtoAdjustment;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
      public function employeeLedger($employeeId)
    {
        $employee = Employee::with('department')->findOrFail($employeeId);

        $credits = $employee->ctoCredits()->get()->map(function($c) {
            return [
                'date' => $c->created_at->format('Y-m-d'),
                'type' => 'CREDITED',
                'description' => $c->activity,
                'details' => $c->overtime_dates_rendered,
                'hours' => $c->hours_earned,
                'remarks' => $c->remarks,
            ];
        });

        $usages = $employee->ctoUsages()->get()->map(function($u) {
            return [
                'date' => $u->created_at->format('Y-m-d'),
                'type' => 'USED',
                'description' => $u->purpose_reason,
                'details' => $u->time_off_dates_used,
                'hours' => -$u->hours_used,
                'remarks' => $u->remarks,
            ];
        });

        $adjustments = $employee->ctoAdjustments()->get()->map(function($a) {
            return [
                'date' => $a->created_at->format('Y-m-d'),
                'type' => 'ADJUSTMENT',
                'description' => 'Manual Adjustment',
                'details' => $a->reason,
                'hours' => $a->adjustment_hours,
                'remarks' => 'Adjusted by HR',
            ];
        });

        $transactions = $credits->concat($usages)->concat($adjustments)->sortBy('date')->values();

        $balance = 0;
        foreach ($transactions as $t) {
            $balance += $t['hours'];
            $t['running_balance'] = $balance;
        }

        return inertia('Reports/EmployeeLedger', [
            'employee' => $employee,
            'transactions' => $transactions,
            'totalEarned' => $employee->ctoCredits()->sum('hours_earned'),
            'totalUsed' => $employee->ctoUsages()->sum('hours_used'),
            'currentBalance' => $balance,
        ]);
    }

    // Monthly Summary
    public function monthlySummary(Request $request)
    {
        $selectedMonth = $request->get('month', date('Y-m'));

        $startDate = $selectedMonth . '-01';
        $endDate = date('Y-m-t', strtotime($startDate));

        $credits = CtoCredit::with('employee.department')
            ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
            ->get()
            ->groupBy('employee.department.name');

        $usages = CtoUsage::with('employee.department')
            ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
            ->get()
            ->groupBy('employee.department.name');

        $summary = [];
        $allDepartments = Department::orderBy('name')->pluck('name');

        foreach ($allDepartments as $deptName) {
            $deptCredits = isset($credits[$deptName]) ? $credits[$deptName]->sum('hours_earned') : 0;
            $deptUsages = isset($usages[$deptName]) ? $usages[$deptName]->sum('hours_used') : 0;
            $summary[] = [
                'department' => $deptName,
                'total_earned' => $deptCredits,
                'total_used' => $deptUsages,
                'balance' => $deptCredits - $deptUsages,
            ];
        }

        $availableMonths = CtoCredit::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month')
            ->union(CtoUsage::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month'))
            ->distinct()
            ->orderBy('month', 'desc')
            ->pluck('month');

        return inertia('Reports/MonthlySummary', [
            'summary' => $summary,
            'selectedMonth' => $selectedMonth,
            'availableMonths' => $availableMonths,
        ]);
    }

    // Department Summary (overall)
    public function departmentSummary()
    {
        $departments = Department::with(['employees.ctoCredits', 'employees.ctoUsages', 'employees.ctoAdjustments'])
            ->orderBy('name')
            ->get()
            ->map(function($dept) {
                $totalEarned = 0;
                $totalUsed = 0;
                $totalAdjustments = 0;
                foreach ($dept->employees as $emp) {
                    $totalEarned += $emp->ctoCredits->sum('hours_earned');
                    $totalUsed += $emp->ctoUsages->sum('hours_used');
                    $totalAdjustments += $emp->ctoAdjustments->sum('adjustment_hours');
                }
                $balance = $totalEarned - $totalUsed + $totalAdjustments;
                return [
                    'department' => $dept->name,
                    'total_employees' => $dept->employees->count(),
                    'total_earned' => $totalEarned,
                    'total_used' => $totalUsed,
                    'balance' => $balance,
                ];
            });

        return inertia('Reports/DepartmentSummary', [
            'departments' => $departments,
        ]);
    }


    public function negativeBalance()
{
    // Get all employees, compute balance using SQL for efficient filtering
    $employees = Employee::with('department')
        ->select('employees.*')
        ->selectRaw('COALESCE((
            SELECT SUM(hours_earned) FROM cto_credits WHERE cto_credits.employee_id = employees.id
        ), 0) - COALESCE((
            SELECT SUM(hours_used) FROM cto_usages WHERE cto_usages.employee_id = employees.id
        ), 0) as balance')
        ->havingRaw('balance < 0')
        ->orderBy('balance', 'asc')
        ->paginate(15);

    $departments = Department::orderBy('name')->get();

    return inertia('Reports/NegativeBalance', [
        'employees' => $employees,
        'departments' => $departments,
    ]);
}
}
