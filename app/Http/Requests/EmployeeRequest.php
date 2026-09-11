<?php
// app/Http/Requests/EmployeeRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Employee;

class EmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Get the employee ID from the route (for update)
        $employeeId = $this->route('employee');

        return [
            'full_name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($employeeId) {
                    $exists = Employee::whereRaw('LOWER(full_name) = ?', [strtolower($value)])
                        ->when($employeeId, fn($q) => $q->where('id', '!=', $employeeId))
                        ->exists();
                    if ($exists) {
                        $fail('An employee with this name already exists (case‑insensitive).');
                    }
                },
            ],
            'department_id' => 'required|exists:departments,id',
            'employment_status' => 'required|in:Job Order,Regular'
        ];
    }

    // Optional: custom messages
    public function messages()
    {
        return [
            'full_name.required' => 'Full name is required.',
            'department_id.required' => 'Please select a department.',
            'employment_status.required' => 'Please select employment status.',
        ];
    }
}
