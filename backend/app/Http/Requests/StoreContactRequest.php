<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'string', 'max:50'],
            'label' => ['required', 'string', 'max:100'],
            'value' => ['required', 'string', 'max:255'],
            'url' => ['nullable', 'url', 'max:500'],
            'order' => ['nullable', 'integer'],
        ];
    }
}
