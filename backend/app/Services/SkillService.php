<?php

namespace App\Services;

use App\Models\Skill;
use App\Repositories\SkillRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class SkillService
{
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
        $this->deleteLocalFile($skill->icon);
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
            $this->deleteLocalFile($oldIcon);
            $path = $data['icon_file']->store('images/skills', 'public');
            $data['icon'] = Storage::disk('public')->url($path);
        } elseif (isset($data['icon_svg']) && $data['icon_svg'] !== '') {
            $this->deleteLocalFile($oldIcon);
            $data['icon'] = $data['icon_svg'];
        }

        unset($data['icon_file'], $data['icon_svg']);
        return $data;
    }

    private function deleteLocalFile(?string $value): void
    {
        if (!$value) return;
        $appUrl = rtrim(config('app.url'), '/');
        $storagePrefix = $appUrl . '/storage/';
        if (str_starts_with($value, $storagePrefix)) {
            $relative = substr($value, strlen($storagePrefix));
            Storage::disk('public')->delete($relative);
        }
    }
}
