<?php

namespace App\Services;

use App\Models\Certificate;
use App\Repositories\CertificateRepository;
use App\Services\Concerns\HandlesImageUpload;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

class CertificateService
{
    use HandlesImageUpload;

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
        $this->deleteImage($certificate->image_path);
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
            $this->deleteImage($oldPath);
            $data['image_path'] = $this->storeImage($data['image_file'], 'certificates', 'certificate');
        } elseif (isset($data['image_url']) && $data['image_url'] !== '') {
            $data['image_path'] = $data['image_url'];
        }

        unset($data['image_file'], $data['image_url']);
        return $data;
    }
}
