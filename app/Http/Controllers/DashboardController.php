<?php
namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\CtoCredit;
use App\Models\CtoUsage;

class DashboardController extends Controller
{
    public function index()
    {
        $totalHoursEarned = CtoCredit::sum('hours_earned');
        $totalHoursUsed = CtoUsage::sum('hours_used');

        // Employees with positive balance (available CTO)
        $employeesWithBalance = Employee::get()->filter(function($employee) {
            return $employee->balance > 0;
        })->count();

        return inertia('Dashboard', [
            'stats' => [
                'employeesWithBalance' => $employeesWithBalance,
                'totalHoursEarned' => number_format($totalHoursEarned, 2),
                'totalHoursUsed' => number_format($totalHoursUsed, 2),
            ],
        ]);
    }
}
