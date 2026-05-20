<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\HeroService;
use Illuminate\Http\JsonResponse;

class HeroController extends Controller
{
    public function __construct(private HeroService $service) {}

    public function index(): JsonResponse
    {
        $data = $this->service->get();
        return response()->json(['success' => true, 'data' => $data]);
    }
}
