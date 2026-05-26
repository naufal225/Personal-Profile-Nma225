<?php

namespace App\Services;

use App\Models\Service;
use App\Repositories\ServiceRepository;
use Illuminate\Database\Eloquent\Collection;

class ServiceService
{
    public function __construct(private ServiceRepository $repository) {}

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function create(array $data): Service
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): Service
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

    public function find(int $id): Service
    {
        return $this->repository->find($id);
    }
}
