<?php
namespace App\Http\Controllers;

use App\Models\CtoUsage;
use App\Models\Employee;
use App\Http\Requests\CtoUsageRequest;
use Illuminate\Http\Request;

class CtoUsageController extends Controller
{
     public function index(Request $request)
    {
        $query = CtoUsage::with('employee');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('employee', function($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%");
            });
        }

        $usages = $query->orderBy('created_at', 'desc')->paginate(10);
        $employees = Employee::orderBy('full_name')->get();

        return inertia('CtoUsages/Index', [
            'usages' => $usages,
            'employees' => $employees,
            'filters' => $request->only('search')
        ]);
    }

    public function store(CtoUsageRequest $request)
    {
        // No balance check – allow negative balance
        CtoUsage::create($request->validated());
        return redirect()->back()->with('success', 'CTO usage recorded successfully.');
    }

    public function destroy(CtoUsage $cto_usage)  // note: parameter name should match route: {cto_usage}
    {
        $cto_usage->delete();
        return redirect()->back()->with('success', 'CTO usage deleted.');
    }


}
