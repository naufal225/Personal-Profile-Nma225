<?php

namespace App\Services\Concerns;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Shared image-upload handling for services. Every uploaded image is renamed by
 * the system to a unique, predictable filename before being stored on the
 * public disk: {prefix}_{Ymd_His}_{10-char random}.{ext}
 *   e.g. certificate_20260625_193449_a1B2c3D4e5.jpg
 */
trait HandlesImageUpload
{
    /**
     * Store an uploaded image under images/{folder} on the public disk with a
     * system-generated unique filename, and return its full public URL.
     */
    protected function storeImage(UploadedFile $file, string $folder, string $prefix): string
    {
        $ext = strtolower($file->extension() ?: $file->getClientOriginalExtension() ?: 'bin');
        $name = sprintf('%s_%s_%s.%s', $prefix, now()->format('Ymd_His'), Str::random(10), $ext);
        $path = $file->storeAs("images/{$folder}", $name, 'public');

        return Storage::disk('public')->url($path);
    }

    /**
     * Delete a previously stored local image given its full public URL.
     * No-op for empty values or external (non-local) URLs.
     */
    protected function deleteImage(?string $fullUrl): void
    {
        if (! $fullUrl) {
            return;
        }

        $storagePrefix = rtrim(config('app.url'), '/') . '/storage/';
        if (str_starts_with($fullUrl, $storagePrefix)) {
            Storage::disk('public')->delete(substr($fullUrl, strlen($storagePrefix)));
        }
    }
}
