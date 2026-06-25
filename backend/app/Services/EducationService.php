<?php

namespace App\Services;

use App\Models\Education;
use App\Repositories\EducationRepository;
use App\Services\Concerns\HandlesImageUpload;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

class EducationService
{
    use HandlesImageUpload;

    public function __construct(private EducationRepository $repository) {}

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function create(array $data): Education
    {
        $data = $this->resolveIcon($data);
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): Education
    {
        $existing = $this->repository->find($id);
        $data = $this->resolveIcon($data, $existing->icon);
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): void
    {
        $education = $this->repository->find($id);
        $this->deleteImage($education->icon);
        $this->repository->delete($id);
    }

    public function find(int $id): Education
    {
        return $this->repository->find($id);
    }

    private function resolveIcon(array $data, ?string $oldIcon = null): array
    {
        if (!empty($data['icon_file']) && $data['icon_file'] instanceof UploadedFile) {
            $this->deleteImage($oldIcon);
            $data['icon'] = $this->storeImage($data['icon_file'], 'educations', 'education');
        } elseif (isset($data['icon_url']) && $data['icon_url'] !== '') {
            $data['icon'] = $data['icon_url'];
        }

        unset($data['icon_file'], $data['icon_url']);
        return $data;
    }
}
