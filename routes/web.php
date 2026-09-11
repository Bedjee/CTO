<?php
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\CtoCreditController;
use App\Http\Controllers\CtoUsageController;
USE App\Http\Controllers\ProfileController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\LedgerController;
USE App\Http\Controllers\CtoAdjustmentController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
});



Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Employee Management
    Route::resource('employees', EmployeeController::class);

    // CTO Credits
   Route::resource('cto-credits', CtoCreditController::class)->except(['show', 'edit']);

    // CTO Usages
    Route::resource('cto-usages', CtoUsageController::class)->except(['show', 'edit', 'update']);
    Route::get('/negative-balance', [ReportController::class, 'negativeBalance'])->name('negative.balance');

  // Move this line UP, before the route with the {employee} parameter
Route::get('/ledger/print', [LedgerController::class, 'print'])->name('ledger.print');

// Then the other ledger routes
Route::get('/ledger', [LedgerController::class, 'index'])->name('ledger.index');
Route::get('/ledger/{employee}', [LedgerController::class, 'show'])->name('ledger.show');

    // Reports
    Route::get('/reports/employee-ledger/{employee}', [ReportController::class, 'employeeLedger'])
        ->name('reports.employee-ledger');
    Route::get('/reports/monthly-summary', [ReportController::class, 'monthlySummary'])
        ->name('reports.monthly-summary');
    Route::get('/reports/department-summary', [ReportController::class, 'departmentSummary'])
        ->name('reports.department-summary');

    // Department Management
    Route::resource('departments', DepartmentController::class)->except(['show']);


    Route::post('/cto-adjustments', [CtoAdjustmentController::class, 'store'])->name('cto-adjustments.store');



});

require __DIR__.'/auth.php';
