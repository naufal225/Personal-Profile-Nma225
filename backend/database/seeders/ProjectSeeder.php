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
                'title' => 'KeepItGrow — Self-Improvement Gamification for Schools',
                'description' => 'A web and mobile self-improvement gamification platform built for school environments. It encourages students to build positive habits through habit tracking, challenges, reward points, and daily reflections — involving teachers and parents in a single ecosystem. Key features: photo-proof verification by teachers, a reward flow, division-based leaderboards using XP/level/coins, and weekly activity charts for parents.',
                'tech_stacks' => ['Laravel', 'Golang', 'Flutter', 'PostgreSQL', 'REST API'],
                'github_url' => 'https://github.com/naufal225/KeepItGrow-Web',
                'demo_url' => null,
                'thumbnail_path' => null,
                'order' => 1,
            ],
            [
                'title' => 'Multiplatform Project Management Application (Web & Mobile)',
                'description' => 'A role-based project management system developed across multiple platforms. The Web Admin Panel is built with Laravel, React, and Inertia.js for administrators who manage users, divisions, and projects. The Mobile App (Android) is built with Kotlin and Jetpack Compose for managers and employees — managing tasks, monitoring progress, and uploading project completion reports.',
                'tech_stacks' => ['Laravel', 'React', 'Inertia.js', 'Kotlin', 'Jetpack Compose', 'MySQL', 'Tailwind CSS'],
                'github_url' => 'https://github.com/naufal225/aplikasi-manajemen-proyek-kp2',
                'demo_url' => null,
                'thumbnail_path' => null,
                'order' => 2,
            ],
            [
                'title' => 'Leave, Reimbursement, Overtime & Business Trip Management Application',
                'description' => 'An internal system for PT Yaztech Engineering Solusindo to manage employee administrative processes — leave requests, reimbursements, overtime, and business trips. It features a flexible multi-role mechanism with six roles: Super Admin, Admin, Approver 1, Approver 2, Approver 3 (Finance), and Employee. Each user can hold more than one role.',
                'tech_stacks' => ['Laravel', 'MySQL', 'Tailwind CSS'],
                'github_url' => null,
                'demo_url' => null,
                'thumbnail_path' => null,
                'order' => 3,
            ],
            [
                'title' => 'Company Profile Website — SMK Telekomunikasi Telesandi',
                'description' => "A dynamic website for the school's official profile, featuring content management, a gallery, news, and a new-student admission (PPDB) data management system.",
                'tech_stacks' => ['Laravel', 'MySQL'],
                'github_url' => null,
                'demo_url' => 'https://smktelekomunikasitelesandi.sch.id/',
                'thumbnail_path' => null,
                'order' => 4,
            ],
            [
                'title' => 'Library Management Application',
                'description' => 'A web-based application for recording books, users, and library members, as well as tracking book borrowing and return transactions.',
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
