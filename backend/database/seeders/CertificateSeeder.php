<?php

namespace Database\Seeders;

use App\Models\Certificate;
use Illuminate\Database\Seeder;

class CertificateSeeder extends Seeder
{
    public function run(): void
    {
        $certificates = [
            // Kompetisi — diurutkan paling prestisius dulu
            [
                'title' => 'Finalis Nasional (Peringkat 6) — LKS IT Software Solution For Business Tingkat Nasional 2025',
                'issuer' => 'Balai Pengembangan Talenta Indonesia (BPTI)',
                'year' => 2025,
                'type' => 'competition',
                'credential_url' => null,
            ],
            [
                'title' => 'Medallion of Excellence (MOE) — LKS IT Software Solution For Business Tingkat Nasional 2025',
                'issuer' => 'Pusat Prestasi Nasional (Puspresnas)',
                'year' => 2025,
                'type' => 'competition',
                'credential_url' => null,
            ],
            [
                'title' => 'Juara 1 — LKS IT Software Solutions For Business Tingkat Provinsi Jawa Barat 2025',
                'issuer' => 'Disdik Provinsi Jawa Barat',
                'year' => 2025,
                'type' => 'competition',
                'credential_url' => null,
            ],
            [
                'title' => 'Juara 1 — LKS IT Software Solutions For Business Tingkat Kabupaten Bekasi 2025',
                'issuer' => 'Disdik Provinsi Jawa Barat & MGMP RPL Kabupaten Bekasi',
                'year' => 2025,
                'type' => 'competition',
                'credential_url' => null,
            ],
            [
                'title' => 'Juara 1 — LKS IT Software Solutions For Business Tingkat Kabupaten Bekasi 2024',
                'issuer' => 'Disdik Provinsi Jawa Barat & MGMP RPL Kabupaten Bekasi',
                'year' => 2024,
                'type' => 'competition',
                'credential_url' => null,
            ],

            // Sertifikasi & Training
            [
                'title' => 'Belajar Dasar Cloud dan Gen AI di AWS',
                'issuer' => 'Dicoding Indonesia',
                'year' => 2025,
                'type' => 'training',
                'credential_url' => null,
            ],
            [
                'title' => 'CPX — Certified Cloud Practitioner Exam',
                'issuer' => 'Dewacloud',
                'year' => 2025,
                'type' => 'training',
                'credential_url' => null,
            ],
            [
                'title' => 'CDP — Cloud Developer PHP',
                'issuer' => 'Dewacloud',
                'year' => 2025,
                'type' => 'training',
                'credential_url' => null,
            ],
            [
                'title' => 'CP2 — Mastering Dewacloud Platform',
                'issuer' => 'Dewacloud',
                'year' => 2025,
                'type' => 'training',
                'credential_url' => null,
            ],
            [
                'title' => 'CP1 — Cloud Foundation',
                'issuer' => 'Dewacloud',
                'year' => 2025,
                'type' => 'training',
                'credential_url' => null,
            ],
            [
                'title' => 'Android Mastery: Membangun Aplikasi E-Commerce dengan Kotlin',
                'issuer' => 'Dunia Coding',
                'year' => 2025,
                'type' => 'training',
                'credential_url' => null,
            ],
            [
                'title' => 'Belajar React JS dari Dasar hingga Siap Deployment Project Sendiri',
                'issuer' => 'Dunia Coding',
                'year' => 2025,
                'type' => 'training',
                'credential_url' => null,
            ],
        ];

        foreach ($certificates as $certificate) {
            Certificate::create($certificate);
        }
    }
}
