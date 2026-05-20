<?php

namespace App\Repositories;

use App\Models\Certificate;
use Illuminate\Database\Eloquent\Collection;

class CertificateRepository
{
    public function __construct(private Certificate $model) {}

    public function getAll(): Collection
    {
        return $this->model->orderBy('year', 'desc')->get();
    }

    public function find(int $id): Certificate
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data): Certificate
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Certificate
    {
        $certificate = $this->find($id);
        $certificate->update($data);
        return $certificate;
    }

    public function delete(int $id): void
    {
        $this->find($id)->delete();
    }
}
