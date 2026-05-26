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
                'institution' => 'Politeknik Negeri Jakarta',
                'major' => 'Teknik Informatika',
                'description' => null,
                'start_year' => 2026,
                'end_year' => null,
            ],
            [
                'institution' => 'SMK Telekomunikasi Telesandi',
                'major' => 'Rekayasa Perangkat Lunak',
                'description' => 'IPK 92. Aktif sebagai Wakil Ketua Ekstrakurikuler Syntax. Meraih Juara 1 LKS IT Software Solution For Business tingkat Kabupaten dan Provinsi Jawa Barat 2025, serta Peringkat 6 dan Medallion of Excellence tingkat Nasional 2025.',
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
