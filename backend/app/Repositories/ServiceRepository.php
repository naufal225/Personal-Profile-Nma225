<?php

namespace App\Repositories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Collection;

class ServiceRepository
{
    public function __construct(private Service $model) {}

    public function getAll(): Collection
    {
        return $this->model->orderBy('order', 'asc')->get();
    }

    public function find(int $id): Service
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data): Service
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Service
    {
        $service = $this->find($id);
        $service->update($data);
        return $service;
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
