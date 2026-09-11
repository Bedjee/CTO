<?php
// app/Http/Controllers/EmployeeController.php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Department;
use App\Http\Requests\EmployeeRequest;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with('department');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhereHas('department', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Order by department first so grouping in the frontend is contiguous
        $employees = $query->orderBy('department_id')
                           ->orderBy('full_name')
                           ->paginate(25); // Increased from 10 to show more employees

        $departments = Department::orderBy('name')->get();

        return inertia('Employees/Index', [
            'employees' => $employees,
            'departments' => $departments,
            'filters' => $request->only('search')
        ]);
    }

    public function store(EmployeeRequest $request)
    {
        Employee::create($request->validated());
        return redirect()->back()->with('success', 'Employee added successfully.');
    }

    public function update(EmployeeRequest $request, Employee $employee)
    {
        $employee->update($request->validated());
        return redirect()->back()->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();
        return redirect()->back()->with('success', 'Employee deleted successfully.');
    }
}
