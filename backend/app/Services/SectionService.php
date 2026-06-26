<?php

namespace App\Services;

use App\Models\Section;
use App\Repositories\SectionRepository;
use Illuminate\Database\Eloquent\Collection;

class SectionService
{
    public function __construct(private SectionRepository $repository) {}

    public function getAll(): Collection
    {
        return $this->repository->getAllOrdered();
    }

    public function getActive(): Collection
    {
        return $this->repository->getActiveOrdered();
    }

    public function find(int $id): Section
    {
        return $this->repository->find($id);
    }

    public function update(int $id, array $data): Section
    {
        return $this->repository->update($id, $data);
    }
}
