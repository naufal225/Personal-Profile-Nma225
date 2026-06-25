<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHeroRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'headline'         => ['required', 'string', 'max:255'],
            'subheadline'      => ['required', 'string'],
            'available_for_work' => ['required', 'boolean'],
            'photo_file'       => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'photo_url'        => ['nullable', 'max:500'],
        ];
    }
}
