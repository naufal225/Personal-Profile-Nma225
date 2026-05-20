<?php

namespace App\Services;

use App\Models\Skill;
use App\Repositories\SkillRepository;
use Illuminate\Database\Eloquent\Collection;

class SkillService
{
    public function __construct(private SkillRepository $repository) {}

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function create(array $data): Skill
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): Skill
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): void
    {
        $this->repository->delete($id);
    }

    public function reorder(array $items): void
    {
        $this->repository->reorder($items);
    }
}
