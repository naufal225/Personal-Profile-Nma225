<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ExperienceService;
use Illuminate\Http\JsonResponse;

class ExperienceController extends Controller
{
    public function __construct(private ExperienceService $service) {}

    public function index(): JsonResponse
    {
        $data = $this->service->getAll();
        return response()->json(['success' => true, 'data' => $data]);
    }
}
