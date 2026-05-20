<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'icon' => ['required', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'max:50'],
            'order' => ['nullable', 'integer'],
        ];
    }
}
