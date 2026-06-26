<?php

namespace App\Repositories;

use App\Models\Section;
use Illuminate\Database\Eloquent\Collection;

class SectionRepository
{
    public function __construct(private Section $model) {}

    public function getAllOrdered(): Collection
    {
        return $this->model->orderBy('order', 'asc')->get();
    }

    public function getActiveOrdered(): Collection
    {
        return $this->model->where('is_active', true)->orderBy('order', 'asc')->get();
    }

    public function find(int $id): Section
    {
        return $this->model->findOrFail($id);
    }

    public function update(int $id, array $data): Section
    {
        $section = $this->find($id);
        $section->update($data);
        return $section;
    }
}
