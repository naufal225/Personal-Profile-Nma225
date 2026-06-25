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
                'description' => 'Developed an internal system for managing employee administration — leave requests, reimbursements, overtime, and business trips. A multi-role system with six role types that can be combined per user.',
                'skills' => ['Laravel', 'MySQL', 'Tailwind CSS', 'Web Development', 'GitHub'],
                'start_date' => '2025-08-01',
                'end_date' => '2025-10-31',
            ],
            [
                'title' => 'Lead',
                'organization' => 'SM-Dev Group',
                'description' => 'Led a freelance web development group. Managed projects and clients, coordinated the developer team, and handled deployment to VPS.',
                'skills' => ['Laravel', 'cPanel', 'Project Management'],
                'start_date' => '2024-09-01',
                'end_date' => '2025-06-30',
            ],
            [
                'title' => 'Vice Chairman',
                'organization' => 'Syntax Creative Tels',
                'description' => 'Led the programming extracurricular as Vice Chairman. Taught junior members, organized coding activities, and mentored competition preparation for the LKS (National Student Skills Competition) from regency to national level.',
                'skills' => ['Laravel', 'Android Studio', 'Leadership', 'Teaching'],
                'start_date' => '2024-06-01',
                'end_date' => '2025-05-31',
            ],
            [
                'title' => 'Member',
                'organization' => 'Syntax Creative Tels',
                'description' => 'Joined the programming extracurricular as a member. Learned the fundamentals of web development and began contributing to internal school projects.',
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
