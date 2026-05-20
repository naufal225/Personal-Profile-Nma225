<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillRequest;
use App\Http\Requests\UpdateSkillRequest;
use App\Services\SkillService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function __construct(private SkillService $service) {}

    public function index(): JsonResponse
    {
        $data = $this->service->getAll();
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function store(StoreSkillRequest $request): JsonResponse
    {
        $data = $this->service->create($request->validated());
        return response()->json(['success' => true, 'data' => $data], 201);
    }

    public function update(UpdateSkillRequest $request, int $id): JsonResponse
    {
        $data = $this->service->update($id, $request->validated());
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return response()->json(['success' => true, 'message' => 'Deleted']);
    }

    public function reorder(Request $request): JsonResponse
    {
        $this->service->reorder($request->input('items', []));
        return response()->json(['success' => true, 'message' => 'Reordered']);
    }
}
