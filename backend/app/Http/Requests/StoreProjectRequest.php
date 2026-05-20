<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'tech_stacks' => ['required', 'array'],
            'tech_stacks.*' => ['string'],
            'github_url' => ['nullable', 'url', 'max:500'],
            'demo_url' => ['nullable', 'url', 'max:500'],
            'thumbnail_path' => ['nullable', 'string', 'max:255'],
            'order' => ['nullable', 'integer'],
        ];
    }
}
