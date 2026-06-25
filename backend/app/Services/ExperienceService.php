<?php

namespace App\Services;

use App\Models\Experience;
use App\Repositories\ExperienceRepository;
use App\Services\Concerns\HandlesImageUpload;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

class ExperienceService
{
    use HandlesImageUpload;

    public function __construct(private ExperienceRepository $repository) {}

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function create(array $data): Experience
    {
        $data = $this->resolveIcon($data);
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): Experience
    {
        $existing = $this->repository->find($id);
        $data = $this->resolveIcon($data, $existing->icon);
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): void
    {
        $experience = $this->repository->find($id);
        $this->deleteImage($experience->icon);
        $this->repository->delete($id);
    }

    public function find(int $id): Experience
    {
        return $this->repository->find($id);
    }

    private function resolveIcon(array $data, ?string $oldIcon = null): array
    {
        if (!empty($data['icon_file']) && $data['icon_file'] instanceof UploadedFile) {
            $this->deleteImage($oldIcon);
            $data['icon'] = $this->storeImage($data['icon_file'], 'experiences', 'experience');
        } elseif (isset($data['icon_url']) && $data['icon_url'] !== '') {
            $data['icon'] = $data['icon_url'];
        }

        unset($data['icon_file'], $data['icon_url']);
        return $data;
    }
}
