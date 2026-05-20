<?php

namespace App\Repositories;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Collection;

class ContactRepository
{
    public function __construct(private Contact $model) {}

    public function getAll(): Collection
    {
        return $this->model->orderBy('order', 'asc')->get();
    }

    public function find(int $id): Contact
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data): Contact
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Contact
    {
        $contact = $this->find($id);
        $contact->update($data);
        return $contact;
    }

    public function delete(int $id): void
    {
        $this->find($id)->delete();
    }
}
