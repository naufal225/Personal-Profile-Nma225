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
                'title' => 'Freelance Full-Stack Developer',
                'organization' => 'Self-employed',
                'description' => 'Developing custom web applications for clients ranging from small businesses to school organizations. Handling full project lifecycle from requirements gathering to deployment.',
                'skills' => ['Laravel', 'React', 'PostgreSQL', 'Tailwind CSS', 'VPS Deployment'],
                'start_date' => '2024-01-01',
                'end_date' => null,
            ],
            [
                'title' => 'Ketua Program Keahlian',
                'organization' => 'OSIS SMK',
                'description' => 'Led the software engineering department program at the school student organization. Coordinated workshops, coding competitions, and internal web projects for school events.',
                'skills' => ['Leadership', 'Project Management', 'Web Development', 'Team Coordination'],
                'start_date' => '2023-07-01',
                'end_date' => '2024-06-30',
            ],
            [
                'title' => 'Web Development Intern',
                'organization' => 'PT. Digital Solusi Nusantara',
                'description' => 'Assisted in building internal web tools using Laravel and Vue.js. Involved in database design, API development, and front-end integration under senior developer supervision.',
                'skills' => ['Laravel', 'Vue.js', 'MySQL', 'REST API', 'Git'],
                'start_date' => '2023-01-01',
                'end_date' => '2023-06-30',
            ],
            [
                'title' => 'Anggota Divisi IT',
                'organization' => 'Ekstrakurikuler Robotik & Programming SMK',
                'description' => 'Participated in school programming extracurricular activities. Competed in regional and national-level web development and IoT competitions.',
                'skills' => ['HTML', 'CSS', 'JavaScript', 'PHP', 'Arduino'],
                'start_date' => '2022-07-01',
                'end_date' => '2023-06-30',
            ],
        ];

        foreach ($experiences as $experience) {
            Experience::create($experience);
        }
    }
}
