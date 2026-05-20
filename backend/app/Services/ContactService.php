<?php

namespace App\Services;

use App\Models\Contact;
use App\Repositories\ContactRepository;
use Illuminate\Database\Eloquent\Collection;

class ContactService
{
    public function __construct(private ContactRepository $repository) {}

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function create(array $data): Contact
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): Contact
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): void
    {
        $this->repository->delete($id);
    }
}
