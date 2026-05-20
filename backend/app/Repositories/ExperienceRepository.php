<?php

namespace App\Repositories;

use App\Models\Experience;
use Illuminate\Database\Eloquent\Collection;

class ExperienceRepository
{
    public function __construct(private Experience $model) {}

    public function getAll(): Collection
    {
        return $this->model->orderBy('start_date', 'desc')->get();
    }

    public function find(int $id): Experience
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data): Experience
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Experience
    {
        $experience = $this->find($id);
        $experience->update($data);
        return $experience;
    }

    public function delete(int $id): void
    {
        $this->find($id)->delete();
    }
}
