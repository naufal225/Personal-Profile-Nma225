<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Additive: creates the `sections` table and seeds the 8 fixed rows here
     * (not in DatabaseSeeder), so `php artisan migrate` is enough on production
     * and `migrate:fresh --seed` won't double-insert. Never run migrate:fresh
     * on production.
     */
    public function up(): void
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->string('key', 50)->unique();
            $table->string('label', 100);
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        $now = now();
        $rows = [
            ['key' => 'about',        'label' => 'About',        'order' => 1],
            ['key' => 'skills',       'label' => 'Skills',       'order' => 2],
            ['key' => 'projects',     'label' => 'Projects',     'order' => 3],
            ['key' => 'journey',      'label' => 'Journey',      'order' => 4],
            ['key' => 'certificates', 'label' => 'Certificates', 'order' => 5],
            ['key' => 'services',     'label' => 'Services',     'order' => 6],
            ['key' => 'contact',      'label' => 'Contact',      'order' => 7],
        ];

        DB::table('sections')->insert(array_map(fn ($r) => [
            ...$r,
            'is_active'  => true,
            'created_at' => $now,
            'updated_at' => $now,
        ], $rows));
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
