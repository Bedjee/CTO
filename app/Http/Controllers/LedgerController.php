<?php
// app/Http/Controllers/LedgerController.php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Department;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LedgerController extends Controller
{
 public function index(Request $request)
{
    $query = Employee::with('department');

    if ($request->filled('department_id')) {
        $query->where('department_id', $request->department_id);
    }

    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function($q) use ($search) {
            $q->where('full_name', 'like', "%{$search}%")
              ->orWhereHas('department', function($q) use ($search) {
                  $q->where('name', 'like', "%{$search}%");
              });
        });
    }

    $employees = $query->paginate(10);

    // Attach computed totals and correct balance
    foreach ($employees as $employee) {
        $employee->total_earned = $employee->ctoCredits()->sum('hours_earned');
        $employee->total_used = $employee->ctoUsages()->sum('hours_used');
        // Use the accessor (includes adjustments)
        $employee->current_balance = $employee->balance;
    }

    $departments = Department::orderBy('name')->get();

    return inertia('Ledger/Index', [
        'employees' => $employees,
        'departments' => $departments,
        'filters' => $request->only(['department_id', 'search'])
    ]);
}



    public function show(Employee $employee)
{
    // Get all credits
    $credits = $employee->ctoCredits()->get()->map(function($credit) {
        return [
            'type' => 'CREDITED',
            'date' => $credit->created_at,
            'activity' => $credit->activity,
            'details' => $credit->overtime_dates_rendered,
            'hours' => $credit->hours_earned,
            'remarks' => $credit->remarks,
        ];
    });

    // Get all usages
    $usages = $employee->ctoUsages()->get()->map(function($usage) {
        return [
            'type' => 'USED',
            'date' => $usage->created_at,
            'activity' => $usage->purpose_reason,
            'details' => $usage->time_off_dates_used,
            'hours' => -$usage->hours_used,
            'remarks' => $usage->remarks,
        ];
    });

    // 👇 ADD THIS PART: Get all adjustments
    $adjustments = $employee->ctoAdjustments()->get()->map(function($adj) {
        return [
            'type' => 'ADJUSTMENT',
            'date' => $adj->created_at,
            'activity' => 'Manual Adjustment',
            'details' => $adj->reason,
            'hours' => $adj->adjustment_hours, // positive or negative
            'remarks' => "Adjusted by: " . ($adj->user?->name ?? 'HR'),
        ];
    });

    // Combine all transactions
    $transactions = $credits->concat($usages)->concat($adjustments)->sortBy('date')->values();

    // Calculate running balance
    $runningBalance = 0;
    foreach ($transactions as $t) {
        $runningBalance += $t['hours'];
        $t['running_balance'] = $runningBalance;
    }

    return inertia('Ledger/Show', [
        'employee' => $employee,
        'transactions' => $transactions,
        'totalEarned' => $employee->ctoCredits()->sum('hours_earned'),
        'totalUsed' => $employee->ctoUsages()->sum('hours_used'),
        'currentBalance' => $runningBalance,
    ]);
}

public function print()
{
    // Get all employees, order by department name then employee name
    $employees = Employee::with('department')
        ->orderBy(
            Department::select('name')->whereColumn('departments.id', 'employees.department_id'),
            'asc'
        )
        ->orderBy('full_name', 'asc')
        ->get();

    // Attach calculated totals
    foreach ($employees as $employee) {
        $employee->total_earned = $employee->ctoCredits()->sum('hours_earned');
        $employee->total_used = $employee->ctoUsages()->sum('hours_used');
        $employee->current_balance = $employee->balance; // includes adjustments
    }

    // Group by department name
    $grouped = [];
    foreach ($employees as $emp) {
        $deptName = $emp->department?->name ?? 'No Department';
        if (!isset($grouped[$deptName])) {
            $grouped[$deptName] = [];
        }
        $grouped[$deptName][] = $emp;
    }

    return inertia('Ledger/Print', [
        'grouped' => $grouped,
    ]);
}



}
