<?php

namespace Database\Seeders;

use App\Models\HeroContent;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Naufal Maruf Ashrori',
            'email' => 'naufalmarufashrori225@gmail.com',
            'password' => 'NmaPortfolio225', // auto-hashed via the User model's 'hashed' cast
        ]);

        HeroContent::create([
            'headline' => 'Backend-Focused Full-Stack Developer',
            'subheadline' => 'I design and build scalable web systems with a strong focus on backend architecture, performance, and maintainability. Experienced in Laravel, REST APIs, SQL, and modern web workflows.',
            'available_for_work' => true,
            // Committed profile photo (storage/app/public/images/photos); URL built from APP_URL.
            'photo_path' => Storage::disk('public')->url('images/photos/profile.jpg'),
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
