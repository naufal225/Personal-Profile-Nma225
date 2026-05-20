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
                'title' => 'Web Application Development',
                'description' => 'Building full-stack web applications tailored to your needs — from REST APIs to interactive SPAs. Clean architecture, proper validation, and production-ready deployment.',
                'icon' => 'device-laptop',
                'order' => 1,
            ],
            [
                'title' => 'REST API Development',
                'description' => 'Designing and building structured, secure RESTful APIs using Laravel. Includes authentication, request validation, consistent response formats, and API documentation.',
                'icon' => 'api',
                'order' => 2,
            ],
            [
                'title' => 'Frontend Development',
                'description' => 'Building responsive and interactive user interfaces with React and Tailwind CSS. Focused on performance, accessibility, and clean component architecture.',
                'icon' => 'layout-2',
                'order' => 3,
            ],
            [
                'title' => 'Database Design',
                'description' => 'Designing efficient relational database schemas for PostgreSQL and MySQL. Covering normalization, indexing, migrations, and query optimization.',
                'icon' => 'database',
                'order' => 4,
            ],
            [
                'title' => 'VPS Deployment & Server Setup',
                'description' => 'Deploying Laravel and React applications to Linux VPS servers. Nginx configuration, SSL setup with Certbot, environment management, and basic server hardening.',
                'icon' => 'server',
                'order' => 5,
            ],
            [
                'title' => 'Code Review & Consultation',
                'description' => 'Reviewing existing codebases for quality, security, and performance issues. Providing actionable feedback and architectural recommendations for improvement.',
                'icon' => 'code',
                'order' => 6,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
