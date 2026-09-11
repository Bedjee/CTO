<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'HR Administrator',
            'email' => 'hr@cto.com',
            'password' => Hash::make('password123'),
            'role' => 'hr',
        ]);


    }
}
