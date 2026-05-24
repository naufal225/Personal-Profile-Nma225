<?php

namespace App\Services;

use App\Models\Certificate;
use App\Repositories\CertificateRepository;
use Illuminate\Database\Eloquent\Collection;

class CertificateService
{
    public function __construct(private CertificateRepository $repository) {}

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function create(array $data): Certificate
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): Certificate
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): void
    {
        $this->repository->delete($id);
    }

    public function find(int $id): Certificate
    {
        return $this->repository->find($id);
    }

    public function reorder(array $items): void
    {
        $this->repository->reorder($items);
    }
}
