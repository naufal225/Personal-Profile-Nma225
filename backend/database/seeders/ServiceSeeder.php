<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'title' => 'Kontraktor',
                'description' => 'Paket website untuk bisnis kontraktor.',
                'icon' => 'kontraktor',
                'order' => 1,
                'metadata' => [
                    'tiers' => [
                        [
                            'name' => 'Basic',
                            'price' => 'Rp3.250.000',
                            'recommended' => false,
                            'note' => 'Cocok untuk kontraktor yang ingin tampil profesional secara online.',
                            'features' => [
                                'Website company profile statis',
                                'Halaman: Home, Tentang, Layanan, Portfolio, Kontak',
                                'Tombol kontak WhatsApp',
                                'Mobile responsive',
                                'Domain .com 1 tahun',
                                'Shared hosting 1 tahun',
                                'SSL',
                            ],
                        ],
                        [
                            'name' => 'Professional',
                            'price' => 'Rp5.250.000',
                            'recommended' => true,
                            'note' => 'Untuk kontraktor yang ingin kelola konten mandiri tanpa developer.',
                            'features' => [
                                'Semua yang ada di Basic, plus:',
                                'CMS portfolio proyek',
                                'Update proyek mandiri',
                                'Galeri proyek dinamis',
                                'SEO basic',
                                'Halaman layanan dinamis',
                            ],
                        ],
                        [
                            'name' => 'Business',
                            'price' => 'Rp8.250.000',
                            'recommended' => false,
                            'note' => 'Solusi lengkap untuk kontraktor skala menengah ke atas.',
                            'features' => [
                                'Semua yang ada di Professional, plus:',
                                'Inquiry form penawaran',
                                'Permintaan penawaran masuk ke email admin',
                                'Upload company profile PDF',
                                'Multi layanan',
                                'Form otomatis ke WhatsApp / email admin',
                            ],
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Klinik',
                'description' => 'Paket website untuk bisnis klinik.',
                'icon' => 'klinik',
                'order' => 2,
                'metadata' => [
                    'tiers' => [
                        [
                            'name' => 'Basic',
                            'price' => 'Rp3.750.000',
                            'recommended' => false,
                            'note' => 'Untuk klinik yang ingin punya kehadiran online yang kredibel.',
                            'features' => [
                                'Profil klinik',
                                'Halaman: Layanan, Dokter, Maps, Kontak',
                                'Domain 1 tahun',
                                'Hosting 1 tahun',
                                'SSL',
                            ],
                        ],
                        [
                            'name' => 'Professional',
                            'price' => 'Rp5.750.000',
                            'recommended' => true,
                            'note' => 'Untuk klinik yang ingin aktif publish konten dan info dokter.',
                            'features' => [
                                'Semua yang ada di Basic, plus:',
                                'CMS artikel kesehatan',
                                'Jadwal dokter editable',
                                'Promo layanan',
                                'Galeri fasilitas',
                            ],
                        ],
                        [
                            'name' => 'Business',
                            'price' => 'Rp8.750.000',
                            'recommended' => false,
                            'note' => 'Untuk klinik yang ingin terima reservasi langsung dari website.',
                            'features' => [
                                'Semua yang ada di Professional, plus:',
                                'Booking form reservasi layanan',
                                'Notifikasi email ke admin',
                                'Booking diteruskan ke WhatsApp admin',
                            ],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
