<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $base = 'https://cdn.simpleicons.org';

        $skills = [
            // Backend
            ['name' => 'Laravel',    'icon' => "$base/laravel",    'category' => 'Backend',       'order' => 1],
            ['name' => 'PHP',        'icon' => "$base/php",        'category' => 'Backend',       'order' => 2],
            ['name' => 'Go',         'icon' => "$base/go",         'category' => 'Backend',       'order' => 3],
            ['name' => 'REST API',   'icon' => "$base/swagger",    'category' => 'Backend',       'order' => 4],

            // Frontend
            ['name' => 'React',      'icon' => "$base/react",      'category' => 'Frontend',      'order' => 5],
            ['name' => 'JavaScript', 'icon' => "$base/javascript", 'category' => 'Frontend',      'order' => 6],
            ['name' => 'TypeScript', 'icon' => "$base/typescript", 'category' => 'Frontend',      'order' => 7],
            ['name' => 'Tailwind CSS','icon' => "$base/tailwindcss",'category' => 'Frontend',     'order' => 8],
            ['name' => 'Inertia.js', 'icon' => "$base/inertia",   'category' => 'Frontend',      'order' => 9],

            // Mobile
            ['name' => 'Flutter',    'icon' => "$base/flutter",    'category' => 'Mobile',        'order' => 10],
            ['name' => 'Kotlin',     'icon' => "$base/kotlin",     'category' => 'Mobile',        'order' => 11],
            ['name' => 'React Native','icon' => "$base/react",     'category' => 'Mobile',        'order' => 12],

            // Database
            ['name' => 'PostgreSQL', 'icon' => "$base/postgresql", 'category' => 'Database',      'order' => 13],
            ['name' => 'MySQL',      'icon' => "$base/mysql",      'category' => 'Database',      'order' => 14],

            // DevOps & Tools
            ['name' => 'Git',        'icon' => "$base/git",        'category' => 'DevOps & Tools','order' => 15],
            ['name' => 'Linux',      'icon' => "$base/linux",      'category' => 'DevOps & Tools','order' => 16],
            ['name' => 'Nginx',      'icon' => "$base/nginx",      'category' => 'DevOps & Tools','order' => 17],
            ['name' => 'Docker',     'icon' => "$base/docker",     'category' => 'DevOps & Tools','order' => 18],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}
