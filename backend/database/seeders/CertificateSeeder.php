<?php

namespace Database\Seeders;

use App\Models\Certificate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class CertificateSeeder extends Seeder
{
    public function run(): void
    {
        // Committed certificate scan (storage/app/public/images/certificates); URL built from APP_URL.
        $moeImage = Storage::disk('public')->url('images/certificates/moe-national-2025.jpg');

        $certificates = [
            [
                'title' => 'Learn React JS from Scratch to Production-Ready Projects',
                'issuer' => 'Dunia Coding',
                'year' => 2025,
                'type' => 'training',
                'credential_url' => null,
                'image_path' => null,
                'order' => 1,
            ],
            [
                'title' => 'Medallion of Excellence (MOE) — National LKS IT Software Solution for Business 2025',
                'issuer' => 'National Achievement Center (Puspresnas)',
                'year' => 2025,
                'type' => 'competition',
                'credential_url' => null,
                'image_path' => $moeImage,
                'order' => 2,
            ],
            [
                'title' => '1st Place — LKS IT Software Solutions for Business, West Java Province 2025',
                'issuer' => 'West Java Provincial Education Office',
                'year' => 2025,
                'type' => 'competition',
                'credential_url' => null,
                'image_path' => null,
                'order' => 3,
            ],
            [
                'title' => '1st Place — LKS IT Software Solutions for Business, Bekasi Regency 2025',
                'issuer' => 'West Java Provincial Education Office & Bekasi Regency RPL Teacher Council (MGMP)',
                'year' => 2025,
                'type' => 'competition',
                'credential_url' => null,
                'image_path' => null,
                'order' => 4,
            ],
            [
                'title' => 'National Finalist (6th Place) — National LKS IT Software Solution for Business 2025',
                'issuer' => 'Indonesian Talent Development Center (BPTI)',
                'year' => 2025,
                'type' => 'competition',
                'credential_url' => null,
                'image_path' => null,
                'order' => 5,
            ],
            [
                'title' => 'Cloud and Gen AI Fundamentals on AWS',
                'issuer' => 'Dicoding Indonesia',
                'year' => 2025,
                'type' => 'training',
                'credential_url' => null,
                'image_path' => null,
                'order' => 6,
            ],
            [
                'title' => 'CPX — Certified Cloud Practitioner Exam',
                'issuer' => 'Dewacloud',
                'year' => 2025,
                'type' => 'training',
                'credential_url' => null,
                'image_path' => null,
                'order' => 7,
            ],
            [
                'title' => 'CDP — Cloud Developer PHP',
                'issuer' => 'Dewacloud',
                'year' => 2025,
                'type' => 'training',
                'credential_url' => null,
                'image_path' => null,
                'order' => 8,
            ],
            [
                'title' => 'CP2 — Mastering the Dewacloud Platform',
                'issuer' => 'Dewacloud',
                'year' => 2025,
                'type' => 'training',
                'credential_url' => null,
                'image_path' => null,
                'order' => 9,
            ],
            [
                'title' => 'CP1 — Cloud Foundation',
                'issuer' => 'Dewacloud',
                'year' => 2025,
                'type' => 'training',
                'credential_url' => null,
                'image_path' => null,
                'order' => 10,
            ],
            [
                'title' => 'Android Mastery: Building an E-Commerce App with Kotlin',
                'issuer' => 'Dunia Coding',
                'year' => 2025,
                'type' => 'training',
                'credential_url' => null,
                'image_path' => null,
                'order' => 11,
            ],
            [
                'title' => '1st Place — LKS IT Software Solutions for Business, Bekasi Regency 2024',
                'issuer' => 'West Java Provincial Education Office & Bekasi Regency RPL Teacher Council (MGMP)',
                'year' => 2024,
                'type' => 'competition',
                'credential_url' => null,
                'image_path' => null,
                'order' => 12,
            ],
        ];

        foreach ($certificates as $certificate) {
            Certificate::create($certificate);
        }
    }
}
