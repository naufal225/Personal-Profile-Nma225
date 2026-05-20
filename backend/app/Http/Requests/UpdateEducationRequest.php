<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEducationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'institution' => ['required', 'string', 'max:255'],
            'major' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_year' => ['required', 'integer', 'digits:4'],
            'end_year' => ['nullable', 'integer', 'digits:4'],
        ];
    }
}
