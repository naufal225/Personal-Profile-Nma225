<?php

namespace App\Repositories;

use App\Models\Education;
use Illuminate\Database\Eloquent\Collection;

class EducationRepository
{
    public function __construct(private Education $model) {}

    public function getAll(): Collection
    {
        return $this->model->orderBy('start_year', 'desc')->get();
    }

    public function find(int $id): Education
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data): Education
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Education
    {
        $education = $this->find($id);
        $education->update($data);
        return $education;
    }

    public function delete(int $id): void
    {
        $this->find($id)->delete();
    }
}
