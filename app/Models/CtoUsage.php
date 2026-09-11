<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CtoUsage extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'purpose_reason',
        'time_off_dates_used',
        'hours_used',
        'remarks'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
