<?php
namespace App\Http\Controllers;

use App\Models\CtoCredit;
use App\Models\Employee;
use App\Http\Requests\CtoCreditRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CtoCreditController extends Controller
{
    public function index(Request $request)
    {
        $query = CtoCredit::with('employee');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('employee', function($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%");
            });
        }

        $credits = $query->orderBy('created_at', 'desc')->paginate(10);
        $employees = Employee::orderBy('full_name')->get();

        return inertia('CtoCredits/Index', [
            'credits' => $credits,
            'employees' => $employees,
            'filters' => $request->only('search')
        ]);
    }

   public function store(CtoCreditRequest $request)
{
    $validated = $request->validated();

    if ($request->has('employee_ids') && is_array($request->employee_ids) && count($request->employee_ids) > 0) {
        $employeeIds = $validated['employee_ids'];
        unset($validated['employee_ids']);

        foreach ($employeeIds as $empId) {
            CtoCredit::create(array_merge($validated, ['employee_id' => $empId]));
        }

        return redirect()->back()->with('success', 'CTO credits added for ' . count($employeeIds) . ' employees.');
    }

    // Single creation (using employee_id)
    CtoCredit::create($validated);
    return redirect()->back()->with('success', 'CTO credit added successfully.');
}




    public function update(CtoCreditRequest $request, CtoCredit $cto_credit)
    {
        $cto_credit->update($request->validated());
        return redirect()->back()->with('success', 'CTO credit updated successfully.');
    }

    public function destroy(CtoCredit $cto_credit)
    {
        $cto_credit->delete();
        return redirect()->back()->with('success', 'CTO credit deleted.');
    }
}
