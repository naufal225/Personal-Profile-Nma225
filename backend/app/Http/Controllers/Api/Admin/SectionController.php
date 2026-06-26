<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSectionRequest;
use App\Services\SectionService;
use Illuminate\Http\JsonResponse;

class SectionController extends Controller
{
    public function __construct(private SectionService $service) {}

    public function index(): JsonResponse
    {
        $data = $this->service->getAll();
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function update(UpdateSectionRequest $request, int $id): JsonResponse
    {
        $data = $this->service->update($id, $request->validated());
        return response()->json(['success' => true, 'data' => $data]);
    }
}
