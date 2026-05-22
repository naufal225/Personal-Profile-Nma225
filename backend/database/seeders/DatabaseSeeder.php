<?php

namespace Database\Seeders;

use App\Models\HeroContent;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Naufal Marufa Ashrori',
            'email' => 'naufalmarufashrori225@gmail.com',
            'password' => Hash::make('password'),
        ]);

        HeroContent::create([
            'headline' => 'Backend-Focused Full-Stack Developer',
            'subheadline' => 'I design and build scalable web systems with a strong focus on backend architecture, performance, and maintainability. Experienced in Laravel, REST APIs, SQL, and modern web workflows.',
            'available_for_work' => true,
            'photo_path' => null,
            'resume_url' => null,
        ]);

        $this->call([
            SkillSeeder::class,
            ProjectSeeder::class,
            ExperienceSeeder::class,
            EducationSeeder::class,
            CertificateSeeder::class,
            ServiceSeeder::class,
            ContactSeeder::class,
        ]);
    }
}
