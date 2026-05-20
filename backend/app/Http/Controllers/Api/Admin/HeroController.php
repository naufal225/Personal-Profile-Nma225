<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateHeroRequest;
use App\Services\HeroService;
use Illuminate\Http\JsonResponse;

class HeroController extends Controller
{
    public function __construct(private HeroService $service) {}

    public function show(): JsonResponse
    {
        $data = $this->service->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function update(UpdateHeroRequest $request): JsonResponse
    {
        $data = $this->service->update($request->validated());
        return response()->json(['success' => true, 'data' => $data]);
    }
}
