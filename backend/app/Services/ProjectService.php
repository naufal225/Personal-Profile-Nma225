<?php

namespace App\Services;

use App\Models\Project;
use App\Repositories\ProjectRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProjectService
{
    public function __construct(private ProjectRepository $repository) {}

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function find(int $id): Project
    {
        return $this->repository->find($id);
    }

    public function create(array $data): Project
    {
        $data = $this->resolveImagePath($data, 'thumbnail');
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): Project
    {
        $existing = $this->repository->find($id);
        $data = $this->resolveImagePath($data, 'thumbnail', $existing->thumbnail_path);
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): void
    {
        $project = $this->repository->find($id);
        $this->deleteLocalFile($project->thumbnail_path);
        $this->repository->delete($id);
    }

    public function reorder(array $items): void
    {
        $this->repository->reorder($items);
    }

    private function resolveImagePath(array $data, string $prefix, ?string $oldPath = null): array
    {
        $fileKey = "{$prefix}_file";
        $urlKey  = "{$prefix}_url";
        $pathKey = "{$prefix}_path";

        if (!empty($data[$fileKey]) && $data[$fileKey] instanceof UploadedFile) {
            $this->deleteLocalFile($oldPath);
            $path = $data[$fileKey]->store("images/{$prefix}s", 'public');
            $data[$pathKey] = Storage::disk('public')->url($path);
        } elseif (isset($data[$urlKey]) && $data[$urlKey] !== '') {
            $data[$pathKey] = $data[$urlKey];
        }

        unset($data[$fileKey], $data[$urlKey]);
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
