<?php
// database/migrations/xxxx_xx_xx_xxxxxx_modify_employees_table_remove_position_and_change_employment_status.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Alternative if the above fails:
public function up(): void
{
    Schema::table('employees', function (Blueprint $table) {
        $table->dropColumn('position');
        $table->dropColumn('employment_status');
    });
    Schema::table('employees', function (Blueprint $table) {
        $table->enum('employment_status', ['Job Order', 'Regular'])->after('department');
    });
}

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->string('position')->after('department');
            $table->string('employment_status')->change();
        });
    }
};
