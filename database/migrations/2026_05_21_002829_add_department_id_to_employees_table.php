<?php
// database/migrations/xxxx_xx_xx_xxxxxx_add_department_id_to_employees_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            // Add department_id column after full_name
            $table->foreignId('department_id')->after('full_name')->constrained()->onDelete('cascade');

            // Remove the old 'department' column (if it still exists as string)
            if (Schema::hasColumn('employees', 'department')) {
                $table->dropColumn('department');
            }


        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropColumn('department_id');
            $table->string('department')->nullable();
            $table->string('employment_status')->change();
        });
    }
};
