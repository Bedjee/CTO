<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CtoCredit extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'activity',
        'overtime_dates_rendered',
        'hours_earned',
        'remarks'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
