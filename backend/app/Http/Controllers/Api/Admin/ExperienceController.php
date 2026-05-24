<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExperienceRequest;
use App\Http\Requests\UpdateExperienceRequest;
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

    public function store(StoreExperienceRequest $request): JsonResponse
    {
        $data = $this->service->create($request->validated());
        return response()->json(['success' => true, 'data' => $data], 201);
    }

    public function update(UpdateExperienceRequest $request, int $id): JsonResponse
    {
        $data = $this->service->update($id, $request->validated());
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return response()->json(['success' => true, 'message' => 'Deleted']);
    }

    public function show(int $id): JsonResponse
    {
        $data = $this->service->find($id);
        return response()->json(['success' => true, 'data' => $data]);
    }
}
