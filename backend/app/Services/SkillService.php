<?php

namespace App\Services;

use App\Models\Skill;
use App\Repositories\SkillRepository;
use App\Services\Concerns\HandlesImageUpload;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

class SkillService
{
    use HandlesImageUpload;

    public function __construct(private SkillRepository $repository) {}

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function create(array $data): Skill
    {
        $data = $this->resolveIcon($data);
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): Skill
    {
        $existing = $this->repository->find($id);
        $data = $this->resolveIcon($data, $existing->icon);
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): void
    {
        $skill = $this->repository->find($id);
        $this->deleteImage($skill->icon);
        $this->repository->delete($id);
    }

    public function reorder(array $items): void
    {
        $this->repository->reorder($items);
    }

    public function find(int $id): Skill
    {
        return $this->repository->find($id);
    }

    private function resolveIcon(array $data, ?string $oldIcon = null): array
    {
        if (!empty($data['icon_file']) && $data['icon_file'] instanceof UploadedFile) {
            $this->deleteImage($oldIcon);
            $data['icon'] = $this->storeImage($data['icon_file'], 'skills', 'skill');
        } elseif (isset($data['icon_svg']) && $data['icon_svg'] !== '') {
            $this->deleteImage($oldIcon);
            $data['icon'] = $data['icon_svg'];
        }

        unset($data['icon_file'], $data['icon_svg']);
        return $data;
    }
}
