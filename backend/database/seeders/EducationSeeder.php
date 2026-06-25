<?php

namespace Database\Seeders;

use App\Models\Education;
use Illuminate\Database\Seeder;

class EducationSeeder extends Seeder
{
    public function run(): void
    {
        $educations = [
            [
                'institution' => 'Politeknik Negeri Jakarta (State Polytechnic of Jakarta)',
                'major' => 'Informatics Engineering',
                'description' => null,
                'start_year' => 2026,
                'end_year' => null,
            ],
            [
                'institution' => 'SMK Telekomunikasi Telesandi',
                'major' => 'Software Engineering',
                'description' => 'GPA 92. Active as Vice Chairman of the Syntax extracurricular. Won 1st place in the LKS IT Software Solution for Business at the Regency and West Java Province levels in 2025, and achieved 6th place along with a Medallion of Excellence at the National level in 2025.',
                'start_year' => 2023,
                'end_year' => 2026,
            ],
            [
                'institution' => 'MTS Al-Khairiyah Papan Mas',
                'major' => null,
                'description' => null,
                'start_year' => 2020,
                'end_year' => 2023,
            ],
        ];

        foreach ($educations as $education) {
            Education::create($education);
        }
    }
}
