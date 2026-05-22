<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            // Backend
            ['name' => 'Laravel', 'icon' => 'laravel', 'category' => 'Backend', 'order' => 1],
            ['name' => 'PHP', 'icon' => 'php', 'category' => 'Backend', 'order' => 2],
            ['name' => 'Go', 'icon' => 'go', 'category' => 'Backend', 'order' => 3],
            ['name' => 'REST API', 'icon' => 'api', 'category' => 'Backend', 'order' => 4],

            // Frontend
            ['name' => 'React', 'icon' => 'react', 'category' => 'Frontend', 'order' => 5],
            ['name' => 'JavaScript', 'icon' => 'javascript', 'category' => 'Frontend', 'order' => 6],
            ['name' => 'TypeScript', 'icon' => 'typescript', 'category' => 'Frontend', 'order' => 7],
            ['name' => 'Tailwind CSS', 'icon' => 'tailwindcss', 'category' => 'Frontend', 'order' => 8],
            ['name' => 'Inertia.js', 'icon' => 'inertiajs', 'category' => 'Frontend', 'order' => 9],

            // Mobile
            ['name' => 'Flutter', 'icon' => 'flutter', 'category' => 'Mobile', 'order' => 10],
            ['name' => 'Kotlin', 'icon' => 'kotlin', 'category' => 'Mobile', 'order' => 11],
            ['name' => 'React Native', 'icon' => 'react', 'category' => 'Mobile', 'order' => 12],

            // Database
            ['name' => 'PostgreSQL', 'icon' => 'postgresql', 'category' => 'Database', 'order' => 13],
            ['name' => 'MySQL', 'icon' => 'mysql', 'category' => 'Database', 'order' => 14],

            // DevOps & Tools
            ['name' => 'Git', 'icon' => 'git', 'category' => 'DevOps & Tools', 'order' => 15],
            ['name' => 'Linux', 'icon' => 'linux', 'category' => 'DevOps & Tools', 'order' => 16],
            ['name' => 'Nginx', 'icon' => 'nginx', 'category' => 'DevOps & Tools', 'order' => 17],
            ['name' => 'Docker', 'icon' => 'docker', 'category' => 'DevOps & Tools', 'order' => 18],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}
