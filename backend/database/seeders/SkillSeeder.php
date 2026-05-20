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
            ['name' => 'Node.js', 'icon' => 'nodejs', 'category' => 'Backend', 'order' => 3],
            ['name' => 'REST API', 'icon' => 'api', 'category' => 'Backend', 'order' => 4],

            // Frontend
            ['name' => 'React', 'icon' => 'react', 'category' => 'Frontend', 'order' => 5],
            ['name' => 'JavaScript', 'icon' => 'javascript', 'category' => 'Frontend', 'order' => 6],
            ['name' => 'TypeScript', 'icon' => 'typescript', 'category' => 'Frontend', 'order' => 7],
            ['name' => 'Tailwind CSS', 'icon' => 'tailwindcss', 'category' => 'Frontend', 'order' => 8],
            ['name' => 'HTML', 'icon' => 'html5', 'category' => 'Frontend', 'order' => 9],
            ['name' => 'CSS', 'icon' => 'css3', 'category' => 'Frontend', 'order' => 10],

            // Database
            ['name' => 'PostgreSQL', 'icon' => 'postgresql', 'category' => 'Database', 'order' => 11],
            ['name' => 'MySQL', 'icon' => 'mysql', 'category' => 'Database', 'order' => 12],

            // DevOps & Tools
            ['name' => 'Git', 'icon' => 'git', 'category' => 'DevOps & Tools', 'order' => 13],
            ['name' => 'GitHub', 'icon' => 'github', 'category' => 'DevOps & Tools', 'order' => 14],
            ['name' => 'Linux', 'icon' => 'linux', 'category' => 'DevOps & Tools', 'order' => 15],
            ['name' => 'Nginx', 'icon' => 'nginx', 'category' => 'DevOps & Tools', 'order' => 16],
            ['name' => 'Docker', 'icon' => 'docker', 'category' => 'DevOps & Tools', 'order' => 17],
            ['name' => 'Vite', 'icon' => 'vite', 'category' => 'DevOps & Tools', 'order' => 18],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}
