<?php

use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\HeroController as AdminHeroController;
use App\Http\Controllers\Api\Admin\SkillController as AdminSkillController;
use App\Http\Controllers\Api\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Api\Admin\ExperienceController as AdminExperienceController;
use App\Http\Controllers\Api\Admin\EducationController as AdminEducationController;
use App\Http\Controllers\Api\Admin\CertificateController as AdminCertificateController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Admin\ContactController as AdminContactController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Auth
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:6,1');
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
    });

    // Public endpoints
    Route::get('/hero', [HeroController::class, 'index']);
    Route::get('/skills', [SkillController::class, 'index']);
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/experiences', [ExperienceController::class, 'index']);
    Route::get('/educations', [EducationController::class, 'index']);
    Route::get('/certificates', [CertificateController::class, 'index']);
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/contacts', [ContactController::class, 'index']);

    // Admin endpoints (protected)
    Route::middleware('auth:sanctum')->prefix('admin')->group(function () {

        // Hero (single record)
        Route::get('/hero', [AdminHeroController::class, 'show']);
        Route::put('/hero', [AdminHeroController::class, 'update']);

        // Skills
        Route::post('/skills/reorder', [AdminSkillController::class, 'reorder']);
        Route::get('/skills', [AdminSkillController::class, 'index']);
        Route::get('/skills/{id}', [AdminSkillController::class, 'show']);
        Route::post('/skills', [AdminSkillController::class, 'store']);
        Route::put('/skills/{id}', [AdminSkillController::class, 'update']);
        Route::delete('/skills/{id}', [AdminSkillController::class, 'destroy']);

        // Projects
        Route::post('/projects/reorder', [AdminProjectController::class, 'reorder']);
        Route::get('/projects', [AdminProjectController::class, 'index']);
        Route::get('/projects/{id}', [AdminProjectController::class, 'show']);
        Route::post('/projects', [AdminProjectController::class, 'store']);
        Route::put('/projects/{id}', [AdminProjectController::class, 'update']);
        Route::delete('/projects/{id}', [AdminProjectController::class, 'destroy']);

        // Experiences
        Route::get('/experiences', [AdminExperienceController::class, 'index']);
        Route::get('/experiences/{id}', [AdminExperienceController::class, 'show']);
        Route::post('/experiences', [AdminExperienceController::class, 'store']);
        Route::put('/experiences/{id}', [AdminExperienceController::class, 'update']);
        Route::delete('/experiences/{id}', [AdminExperienceController::class, 'destroy']);

        // Educations
        Route::get('/educations', [AdminEducationController::class, 'index']);
        Route::get('/educations/{id}', [AdminEducationController::class, 'show']);
        Route::post('/educations', [AdminEducationController::class, 'store']);
        Route::put('/educations/{id}', [AdminEducationController::class, 'update']);
        Route::delete('/educations/{id}', [AdminEducationController::class, 'destroy']);

        // Certificates
        Route::post('/certificates/reorder', [AdminCertificateController::class, 'reorder']);
        Route::get('/certificates', [AdminCertificateController::class, 'index']);
        Route::get('/certificates/{id}', [AdminCertificateController::class, 'show']);
        Route::post('/certificates', [AdminCertificateController::class, 'store']);
        Route::put('/certificates/{id}', [AdminCertificateController::class, 'update']);
        Route::delete('/certificates/{id}', [AdminCertificateController::class, 'destroy']);

        // Services
        Route::post('/services/reorder', [AdminServiceController::class, 'reorder']);
        Route::get('/services', [AdminServiceController::class, 'index']);
        Route::get('/services/{id}', [AdminServiceController::class, 'show']);
        Route::post('/services', [AdminServiceController::class, 'store']);
        Route::put('/services/{id}', [AdminServiceController::class, 'update']);
        Route::delete('/services/{id}', [AdminServiceController::class, 'destroy']);

        // Contacts
        Route::get('/contacts', [AdminContactController::class, 'index']);
        Route::get('/contacts/{id}', [AdminContactController::class, 'show']);
        Route::post('/contacts', [AdminContactController::class, 'store']);
        Route::put('/contacts/{id}', [AdminContactController::class, 'update']);
        Route::delete('/contacts/{id}', [AdminContactController::class, 'destroy']);
    });
});
