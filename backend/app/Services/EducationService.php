<?php

namespace App\Services;

use App\Models\Education;
use App\Repositories\EducationRepository;
use Illuminate\Database\Eloquent\Collection;

class EducationService
{
    public function __construct(private EducationRepository $repository) {}

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function create(array $data): Education
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): Education
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): void
    {
        $this->repository->delete($id);
    }

    public function find(int $id): Education
    {
        return $this->repository->find($id);
    }
}
