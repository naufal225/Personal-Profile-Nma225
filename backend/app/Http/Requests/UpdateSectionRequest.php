<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // key / label / order are fixed — only visibility can be toggled.
        return [
            'is_active' => ['required', 'boolean'],
        ];
    }
}
