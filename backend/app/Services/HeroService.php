<?php

namespace App\Services;

use App\Models\HeroContent;
use App\Repositories\HeroContentRepository;

class HeroService
{
    public function __construct(private HeroContentRepository $repository) {}

    public function get(): ?HeroContent
    {
        return $this->repository->get();
    }

    public function update(array $data): HeroContent
    {
        return $this->repository->update($data);
    }
}
