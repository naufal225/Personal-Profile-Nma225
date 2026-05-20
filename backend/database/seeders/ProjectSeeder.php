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
                'title' => 'Portfolio CMS',
                'description' => 'Personal portfolio website with a full CMS admin panel. Built as a monorepo with a Laravel REST API backend and a React SPA frontend. Features content management for projects, skills, experiences, certificates, and more.',
                'tech_stacks' => ['Laravel', 'React', 'PostgreSQL', 'Tailwind CSS', 'Sanctum', 'Vite'],
                'github_url' => 'https://github.com/naufalmarufashrori/portfolio',
                'demo_url' => null,
                'thumbnail_path' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                'order' => 1,
            ],
            [
                'title' => 'School Management System',
                'description' => 'Web-based school management system covering student data, attendance, grading, and teacher management. Includes a role-based access control system for admin, teachers, and students.',
                'tech_stacks' => ['Laravel', 'MySQL', 'Bootstrap', 'jQuery'],
                'github_url' => 'https://github.com/naufalmarufashrori/school-management',
                'demo_url' => null,
                'thumbnail_path' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
                'order' => 2,
            ],
            [
                'title' => 'E-Commerce REST API',
                'description' => 'RESTful API for a simple e-commerce platform. Covers product management, cart, orders, and payment status tracking. Built with service-repository architecture and tested with Postman.',
                'tech_stacks' => ['Laravel', 'PostgreSQL', 'Sanctum'],
                'github_url' => 'https://github.com/naufalmarufashrori/ecommerce-api',
                'demo_url' => null,
                'thumbnail_path' => 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=800&q=80',
                'order' => 3,
            ],
            [
                'title' => 'Task Manager App',
                'description' => 'A Trello-inspired task management app with drag-and-drop board columns, real-time status updates, and team collaboration features. Frontend built with React and Zustand for state management.',
                'tech_stacks' => ['React', 'Zustand', 'Tailwind CSS', 'Laravel', 'PostgreSQL'],
                'github_url' => 'https://github.com/naufalmarufashrori/task-manager',
                'demo_url' => 'https://task.naufaldev.my.id',
                'thumbnail_path' => 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&w=800&q=80',
                'order' => 4,
            ],
            [
                'title' => 'Inventory Management System',
                'description' => 'Internal inventory tracking system for small businesses. Features stock-in/out recording, supplier management, low-stock alerts, and a simple reporting dashboard.',
                'tech_stacks' => ['Laravel', 'MySQL', 'Blade', 'Alpine.js'],
                'github_url' => null,
                'demo_url' => null,
                'thumbnail_path' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
                'order' => 5,
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
