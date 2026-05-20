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
                'institution' => 'SMK Negeri 1 Telesandi',
                'major' => 'Rekayasa Perangkat Lunak (Software Engineering)',
                'description' => 'Focused on software development fundamentals, web programming, database management, and object-oriented programming. Graduated with honors. Active in programming competitions and school IT extracurricular.',
                'start_year' => 2022,
                'end_year' => 2025,
            ],
            [
                'institution' => 'SMP Negeri 2 Bandung',
                'major' => null,
                'description' => 'Junior high school. First exposure to basic computer science and programming concepts through school electives.',
                'start_year' => 2019,
                'end_year' => 2022,
            ],
        ];

        foreach ($educations as $education) {
            Education::create($education);
        }
    }
}
