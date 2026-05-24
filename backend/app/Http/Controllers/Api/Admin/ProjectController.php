<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(private ProjectService $service) {}

    public function index(): JsonResponse
    {
        $data = $this->service->getAll();
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $data = $this->service->create($request->validated());
        return response()->json(['success' => true, 'data' => $data], 201);
    }

    public function update(UpdateProjectRequest $request, int $id): JsonResponse
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

    public function show(int $id): JsonResponse
    {
        $data = $this->service->find($id);
        return response()->json(['success' => true, 'data' => $data]);
    }
}
