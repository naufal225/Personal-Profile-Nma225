<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('experiences', function (Blueprint $table) {
            $table->string('icon', 255)->nullable()->after('organization');
        });

        Schema::table('educations', function (Blueprint $table) {
            $table->string('icon', 255)->nullable()->after('institution');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('experiences', function (Blueprint $table) {
            $table->dropColumn('icon');
        });

        Schema::table('educations', function (Blueprint $table) {
            $table->dropColumn('icon');
        });
    }
};
