<?php

namespace App\Repositories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class ProjectRepository
{
    public function __construct(private Project $model) {}

    public function getAll(): Collection
    {
        return $this->model->orderBy('order', 'asc')->get();
    }

    public function find(int $id): Project
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data): Project
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Project
    {
        $project = $this->find($id);
        $project->update($data);
        return $project;
    }

    public function delete(int $id): void
    {
        $this->find($id)->delete();
    }

    public function reorder(array $items): void
    {
        foreach ($items as $item) {
            $this->model->where('id', $item['id'])->update(['order' => $item['order']]);
        }
    }
}
