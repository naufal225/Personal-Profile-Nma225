<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SectionService;
use Illuminate\Http\JsonResponse;

class SectionController extends Controller
{
    public function __construct(private SectionService $service) {}

    public function index(): JsonResponse
    {
        $data = $this->service->getActive();
        return response()->json(['success' => true, 'data' => $data]);
    }
}
