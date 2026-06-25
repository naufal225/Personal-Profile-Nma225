<?php

namespace App\Services;

use App\Models\Certificate;
use App\Repositories\CertificateRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CertificateService
{
    public function __construct(private CertificateRepository $repository) {}

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function create(array $data): Certificate
    {
        $data = $this->resolveImagePath($data);
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): Certificate
    {
        $existing = $this->repository->find($id);
        $data = $this->resolveImagePath($data, $existing->image_path);
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): void
    {
        $certificate = $this->repository->find($id);
        $this->deleteLocalFile($certificate->image_path);
        $this->repository->delete($id);
    }

    public function find(int $id): Certificate
    {
        return $this->repository->find($id);
    }

    public function reorder(array $items): void
    {
        $this->repository->reorder($items);
    }

    private function resolveImagePath(array $data, ?string $oldPath = null): array
    {
        if (!empty($data['image_file']) && $data['image_file'] instanceof UploadedFile) {
            $this->deleteLocalFile($oldPath);
            $path = $data['image_file']->store('images/certificates', 'public');
            $data['image_path'] = Storage::disk('public')->url($path);
        } elseif (isset($data['image_url']) && $data['image_url'] !== '') {
            $data['image_path'] = $data['image_url'];
        }

        unset($data['image_file'], $data['image_url']);
        return $data;
    }

    private function deleteLocalFile(?string $fullUrl): void
    {
        if (!$fullUrl) return;
        $appUrl = rtrim(config('app.url'), '/');
        $storagePrefix = $appUrl . '/storage/';
        if (str_starts_with($fullUrl, $storagePrefix)) {
            $relative = substr($fullUrl, strlen($storagePrefix));
            Storage::disk('public')->delete($relative);
        }
    }
}
