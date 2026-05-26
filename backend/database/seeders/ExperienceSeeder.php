<?php

namespace Database\Seeders;

use App\Models\Experience;
use Illuminate\Database\Seeder;

class ExperienceSeeder extends Seeder
{
    public function run(): void
    {
        $experiences = [
            [
                'title' => 'Programmer',
                'organization' => 'PT Yaztech Engineering Solusindo',
                'description' => 'Mengembangkan sistem internal untuk pengelolaan administrasi karyawan — pengajuan cuti, reimbursement, lembur, dan perjalanan dinas. Sistem multi-role dengan enam jenis peran yang dapat dikombinasikan per pengguna.',
                'skills' => ['Laravel', 'MySQL', 'Tailwind CSS', 'Web Development', 'GitHub'],
                'start_date' => '2025-08-01',
                'end_date' => '2025-10-31',
            ],
            [
                'title' => 'Ketua',
                'organization' => 'SM-Dev Group',
                'description' => 'Memimpin kelompok freelance pengembangan web. Mengelola proyek dan klien, koordinasi tim developer, serta deployment ke VPS.',
                'skills' => ['Laravel', 'cPanel', 'Project Management'],
                'start_date' => '2024-09-01',
                'end_date' => '2025-06-30',
            ],
            [
                'title' => 'Wakil Ketua',
                'organization' => 'Syntax Creative Tels',
                'description' => 'Memimpin ekstrakurikuler pemrograman sebagai Wakil Ketua. Mengajar anggota junior, mengorganisir kegiatan coding, dan membimbing persiapan lomba LKS tingkat kabupaten hingga nasional.',
                'skills' => ['Laravel', 'Android Studio', 'Leadership', 'Teaching'],
                'start_date' => '2024-06-01',
                'end_date' => '2025-05-31',
            ],
            [
                'title' => 'Member',
                'organization' => 'Syntax Creative Tels',
                'description' => 'Bergabung sebagai anggota ekstrakurikuler pemrograman. Belajar dasar-dasar web development dan mulai terlibat dalam proyek internal sekolah.',
                'skills' => ['HTML', 'CSS', 'JavaScript', 'PHP'],
                'start_date' => '2023-06-01',
                'end_date' => '2024-06-30',
            ],
        ];

        foreach ($experiences as $experience) {
            Experience::create($experience);
        }
    }
}
