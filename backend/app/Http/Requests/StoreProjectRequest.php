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
            'title'          => ['required', 'string', 'max:255'],
            'description'    => ['required', 'string'],
            'tech_stacks'    => ['nullable', 'array'],
            'tech_stacks.*'  => ['string'],
            'github_url'     => ['nullable', 'url', 'max:500'],
            'demo_url'       => ['nullable', 'url', 'max:500'],
            'order'          => ['nullable', 'integer'],
            'thumbnail_file' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'thumbnail_url'  => ['nullable', 'max:500'],
        ];
    }
}
