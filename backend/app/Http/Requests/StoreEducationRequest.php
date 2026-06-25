<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEducationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'institution' => ['required', 'string', 'max:255'],
            'icon_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:2048'],
            'icon_url' => ['nullable', 'max:500'],
            'major' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_year' => ['required', 'integer', 'digits:4'],
            'end_year' => ['nullable', 'integer', 'digits:4'],
        ];
    }
}
