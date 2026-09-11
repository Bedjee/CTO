<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CtoCreditRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'activity' => 'required|string|max:255',
            'overtime_dates_rendered' => 'required|string',
            'hours_earned' => 'required|numeric|min:0.01',
            'remarks' => 'nullable|string'
        ];

        if ($this->isMethod('post')) {
            // For store: either employee_id (single) or employee_ids (bulk)
            // employee_id is optional, but if provided it must exist
            $rules['employee_id'] = 'nullable|exists:employees,id';
            // employee_ids is required if employee_id is not provided
            $rules['employee_ids'] = 'required_without:employee_id|array|min:1';
            $rules['employee_ids.*'] = 'exists:employees,id';
        } else {
            // For update: employee_id is required
            $rules['employee_id'] = 'required|exists:employees,id';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'employee_ids.required_without' => 'Please select at least one employee.',
            'employee_ids.*.exists' => 'One or more selected employees are invalid.',
            'employee_id.exists' => 'The selected employee is invalid.',
        ];
    }
}
