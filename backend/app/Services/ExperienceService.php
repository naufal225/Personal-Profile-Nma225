<?php

namespace App\Services;

use App\Models\Experience;
use App\Repositories\ExperienceRepository;
use Illuminate\Database\Eloquent\Collection;

class ExperienceService
{
    public function __construct(private ExperienceRepository $repository) {}

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function create(array $data): Experience
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): Experience
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): void
    {
        $this->repository->delete($id);
    }
}
