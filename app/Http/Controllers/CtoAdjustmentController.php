<?php
// app/Http/Controllers/CtoAdjustmentController.php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\CtoAdjustment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CtoAdjustmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'adjustment_hours' => 'required|numeric|not_in:0',
            'reason' => 'required|string|max:500',
        ]);

        $adjustment = CtoAdjustment::create([
            'employee_id' => $request->employee_id,
            'user_id' => Auth::id(),
            'adjustment_hours' => $request->adjustment_hours,
            'reason' => $request->reason,
        ]);

        return redirect()->back()->with('success', 'Balance adjusted successfully.');
    }
}
