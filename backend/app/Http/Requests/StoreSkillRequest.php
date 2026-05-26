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
            'name'      => ['required', 'string', 'max:100'],
            'icon_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:2048'],
            'icon_svg'  => ['nullable', 'string', 'max:20000'],
            'category'  => ['nullable', 'string', 'max:50'],
            'order'     => ['nullable', 'integer'],
        ];
    }

    public function after(): array
    {
        return [
            function ($validator) {
                if (!$this->filled('icon_file') && !$this->filled('icon_svg')) {
                    $validator->errors()->add('icon', 'An icon is required. Upload an image or paste SVG code.');
                }
            },
        ];
    }
}
