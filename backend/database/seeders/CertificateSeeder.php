<?php

namespace Database\Seeders;

use App\Models\Certificate;
use Illuminate\Database\Seeder;

class CertificateSeeder extends Seeder
{
    public function run(): void
    {
        $certificates = [
            [
                'title' => 'Belajar Membuat Aplikasi Back-End untuk Pemula',
                'issuer' => 'Dicoding Indonesia',
                'year' => 2024,
                'type' => 'training',
                'credential_url' => 'https://www.dicoding.com/certificates/erzr41ynkpyv',
            ],
            [
                'title' => 'Belajar Dasar Pemrograman Web',
                'issuer' => 'Dicoding Indonesia',
                'year' => 2024,
                'type' => 'training',
                'credential_url' => 'https://www.dicoding.com/certificates/07z6l3gorzqr',
            ],
            [
                'title' => 'Belajar Dasar Git dengan GitHub',
                'issuer' => 'Dicoding Indonesia',
                'year' => 2024,
                'type' => 'training',
                'credential_url' => 'https://www.dicoding.com/certificates/81p2oeldgpoy',
            ],
            [
                'title' => 'Juara 2 Web Design — LKS Tingkat Kota',
                'issuer' => 'Dinas Pendidikan Kota Bandung',
                'year' => 2024,
                'type' => 'competition',
                'credential_url' => null,
            ],
            [
                'title' => 'Peserta LKS Web Technologies — Tingkat Provinsi',
                'issuer' => 'Dinas Pendidikan Provinsi Jawa Barat',
                'year' => 2024,
                'type' => 'competition',
                'credential_url' => null,
            ],
            [
                'title' => 'Belajar Dasar Pemrograman JavaScript',
                'issuer' => 'Dicoding Indonesia',
                'year' => 2023,
                'type' => 'training',
                'credential_url' => 'https://www.dicoding.com/certificates/qlz9ly8kqp5d',
            ],
            [
                'title' => 'Memulai Pemrograman dengan Python',
                'issuer' => 'Dicoding Indonesia',
                'year' => 2023,
                'type' => 'training',
                'credential_url' => 'https://www.dicoding.com/certificates/53xe5d5mjxrn',
            ],
            [
                'title' => 'Juara 1 Web Development — Internal School Competition',
                'issuer' => 'SMK Negeri 1 Telesandi',
                'year' => 2023,
                'type' => 'achievement',
                'credential_url' => null,
            ],
        ];

        foreach ($certificates as $certificate) {
            Certificate::create($certificate);
        }
    }
}
