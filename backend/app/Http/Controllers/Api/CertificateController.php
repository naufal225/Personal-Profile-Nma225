<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CertificateService;
use Illuminate\Http\JsonResponse;

class CertificateController extends Controller
{
    public function __construct(private CertificateService $service) {}

    public function index(): JsonResponse
    {
        $data = $this->service->getAll();
        return response()->json(['success' => true, 'data' => $data]);
    }
}
