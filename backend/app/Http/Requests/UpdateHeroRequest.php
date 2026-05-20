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
            'headline' => ['required', 'string', 'max:255'],
            'subheadline' => ['required', 'string'],
            'photo_path' => ['nullable', 'string', 'max:255'],
            'available_for_work' => ['required', 'boolean'],
            'resume_url' => ['nullable', 'url', 'max:255'],
        ];
    }
}
