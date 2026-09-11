<?php
// app/Http/Controllers/DepartmentController.php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::orderBy('name')->paginate(10);
        return inertia('Departments/Index', [
            'departments' => $departments
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:departments,name|max:255'
        ]);

        Department::create($request->only('name'));
        return redirect()->back()->with('success', 'Department added.');
    }

    public function update(Request $request, Department $department)
    {
        $request->validate([
            'name' => 'required|string|unique:departments,name,' . $department->id . '|max:255'
        ]);

        $department->update($request->only('name'));
        return redirect()->back()->with('success', 'Department updated.');
    }

    public function destroy(Department $department)
    {
        // Check if department has employees
        if ($department->employees()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete department with existing employees.');
        }
        $department->delete();
        return redirect()->back()->with('success', 'Department deleted.');
    }
}
