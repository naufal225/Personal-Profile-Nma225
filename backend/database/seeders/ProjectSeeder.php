<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'title' => 'KeepItGrow — Gamifikasi Self Improvement Untuk Sekolah',
                'description' => 'Platform gamifikasi self-improvement berbasis web dan mobile untuk lingkungan sekolah. Mendorong siswa membangun kebiasaan positif melalui habit tracking, challenge, poin reward, dan refleksi harian — melibatkan guru dan orang tua dalam satu ekosistem. Fitur utama: verifikasi bukti foto oleh guru, reward flow, leaderboard per divisi berbasis XP/level/koin, dan grafik keaktifan mingguan untuk orang tua.',
                'tech_stacks' => ['Laravel', 'Golang', 'Flutter', 'PostgreSQL', 'REST API'],
                'github_url' => null,
                'demo_url' => null,
                'thumbnail_path' => null,
                'order' => 1,
            ],
            [
                'title' => 'Aplikasi Manajemen Proyek Multiplatform (Web & Mobile)',
                'description' => 'Sistem manajemen proyek berbasis peran yang dikembangkan secara multiplatform. Web Admin Panel dibangun dengan Laravel, React, dan Inertia.js untuk administrator yang mengelola pengguna, divisi, dan proyek. Mobile App (Android) dibangun dengan Kotlin dan Jetpack Compose untuk manajer dan karyawan — mengelola tugas, memantau progres, dan mengunggah laporan penyelesaian proyek.',
                'tech_stacks' => ['Laravel', 'React', 'Inertia.js', 'Kotlin', 'Jetpack Compose', 'MySQL', 'Tailwind CSS'],
                'github_url' => 'https://github.com/naufal225/aplikasi-manajemen-proyek-kp2',
                'demo_url' => null,
                'thumbnail_path' => null,
                'order' => 2,
            ],
            [
                'title' => 'Aplikasi Pengelolaan Cuti, Reimbursement, Overtime & Perjalanan Dinas',
                'description' => 'Sistem internal untuk PT Yaztech Engineering Solusindo dalam mengelola proses administrasi karyawan — pengajuan cuti, reimbursement, lembur, dan perjalanan dinas. Memiliki mekanisme multi-role fleksibel dengan enam peran: Super Admin, Admin, Approver 1, Approver 2, Approver 3 (Finance), dan Employee. Setiap pengguna dapat memiliki lebih dari satu role.',
                'tech_stacks' => ['Laravel', 'MySQL', 'Tailwind CSS'],
                'github_url' => null,
                'demo_url' => null,
                'thumbnail_path' => null,
                'order' => 3,
            ],
            [
                'title' => 'Web Company Profile SMK Telekomunikasi Telesandi',
                'description' => 'Website dinamis untuk profil resmi sekolah, dilengkapi fitur manajemen konten, galeri, berita, dan sistem pengelolaan data PPDB.',
                'tech_stacks' => ['Laravel', 'MySQL'],
                'github_url' => null,
                'demo_url' => null,
                'thumbnail_path' => null,
                'order' => 4,
            ],
            [
                'title' => 'Aplikasi Manajemen Perpustakaan',
                'description' => 'Aplikasi berbasis web untuk pendataan buku, pengguna, anggota perpustakaan, serta pencatatan transaksi peminjaman dan pengembalian buku.',
                'tech_stacks' => ['Laravel', 'Bootstrap', 'MySQL'],
                'github_url' => null,
                'demo_url' => null,
                'thumbnail_path' => null,
                'order' => 5,
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
