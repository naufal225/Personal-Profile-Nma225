<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSkillRequest extends FormRequest
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
}
