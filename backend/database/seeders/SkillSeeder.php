<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        // Self-hosted SVG icons committed under storage/app/public/images/skills.
        // URL is built from APP_URL so it stays correct in production.
        $icon = fn (string $slug) => Storage::disk('public')->url("images/skills/{$slug}.svg");

        $skills = [
            // Backend
            ['name' => 'Laravel',      'icon' => $icon('laravel'),      'category' => 'Backend',        'order' => 1],
            ['name' => 'PHP',          'icon' => $icon('php'),          'category' => 'Backend',        'order' => 2],
            ['name' => 'Go',           'icon' => $icon('go'),           'category' => 'Backend',        'order' => 3],
            ['name' => 'REST API',     'icon' => $icon('rest-api'),     'category' => 'Backend',        'order' => 4],

            // Frontend
            ['name' => 'React',        'icon' => $icon('react'),        'category' => 'Frontend',       'order' => 5],
            ['name' => 'JavaScript',   'icon' => $icon('javascript'),   'category' => 'Frontend',       'order' => 6],
            ['name' => 'TypeScript',   'icon' => $icon('typescript'),   'category' => 'Frontend',       'order' => 7],
            ['name' => 'Tailwind CSS', 'icon' => $icon('tailwindcss'),  'category' => 'Frontend',       'order' => 8],
            ['name' => 'Inertia.js',   'icon' => $icon('inertia'),      'category' => 'Frontend',       'order' => 9],

            // Mobile
            ['name' => 'Flutter',      'icon' => $icon('flutter'),      'category' => 'Mobile',         'order' => 10],
            ['name' => 'Kotlin',       'icon' => $icon('kotlin'),       'category' => 'Mobile',         'order' => 11],
            ['name' => 'React Native', 'icon' => $icon('react-native'), 'category' => 'Mobile',         'order' => 12],

            // Database
            ['name' => 'PostgreSQL',   'icon' => $icon('postgresql'),   'category' => 'Database',       'order' => 13],
            ['name' => 'MySQL',        'icon' => $icon('mysql'),        'category' => 'Database',       'order' => 14],

            // DevOps & Tools
            ['name' => 'Git',          'icon' => $icon('git'),          'category' => 'DevOps & Tools', 'order' => 15],
            ['name' => 'Linux',        'icon' => $icon('linux'),        'category' => 'DevOps & Tools', 'order' => 16],
            ['name' => 'Nginx',        'icon' => $icon('nginx'),        'category' => 'DevOps & Tools', 'order' => 17],
            ['name' => 'Docker',       'icon' => $icon('docker'),       'category' => 'DevOps & Tools', 'order' => 18],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}
