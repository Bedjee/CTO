<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'department_id',
        'employment_status'
    ];

    // Include the 'balance' accessor in JSON responses
    protected $appends = ['balance'];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function ctoCredits()
    {
        return $this->hasMany(CtoCredit::class);
    }

    public function ctoUsages()
    {
        return $this->hasMany(CtoUsage::class);
    }




public function ctoAdjustments()
{
    return $this->hasMany(CtoAdjustment::class);
}

public function getBalanceAttribute()
{
    $totalEarned = $this->ctoCredits()->sum('hours_earned');
    $totalUsed = $this->ctoUsages()->sum('hours_used');
    $totalAdjustments = $this->ctoAdjustments()->sum('adjustment_hours');
    return $totalEarned - $totalUsed + $totalAdjustments;
}
}
