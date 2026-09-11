<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CtoUsageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|exists:employees,id',
            'purpose_reason' => 'required|string|max:255',
            'time_off_dates_used' => 'required|string',
            'hours_used' => 'required|numeric|min:0.01',
            'remarks' => 'nullable|string'
        ];
    }
}
