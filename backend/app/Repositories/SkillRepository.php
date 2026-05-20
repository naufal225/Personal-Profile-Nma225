<?php

namespace App\Repositories;

use App\Models\Skill;
use Illuminate\Database\Eloquent\Collection;

class SkillRepository
{
    public function __construct(private Skill $model) {}

    public function getAll(): Collection
    {
        return $this->model->orderBy('order', 'asc')->get();
    }

    public function find(int $id): Skill
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data): Skill
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Skill
    {
        $skill = $this->find($id);
        $skill->update($data);
        return $skill;
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
