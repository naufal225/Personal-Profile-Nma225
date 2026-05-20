<?php

namespace App\Services;

use App\Models\Project;
use App\Repositories\ProjectRepository;
use Illuminate\Database\Eloquent\Collection;

class ProjectService
{
    public function __construct(private ProjectRepository $repository) {}

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function create(array $data): Project
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): Project
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
