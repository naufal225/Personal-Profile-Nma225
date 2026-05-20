<?php

namespace App\Repositories;

use App\Models\HeroContent;

class HeroContentRepository
{
    public function __construct(private HeroContent $model) {}

    public function get(): ?HeroContent
    {
        return $this->model->first();
    }

    public function update(array $data): HeroContent
    {
        $hero = $this->model->firstOrNew([]);
        $hero->fill($data);
        $hero->save();
        return $hero;
    }
}
