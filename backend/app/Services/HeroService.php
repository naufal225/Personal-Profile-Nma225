<?php

namespace App\Services;

use App\Models\HeroContent;
use App\Repositories\HeroContentRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class HeroService
{
    public function __construct(private HeroContentRepository $repository) {}

    public function get(): ?HeroContent
    {
        return $this->repository->get();
    }

    public function update(array $data): HeroContent
    {
        $existing = $this->repository->get();
        $data = $this->resolveImagePath($data, 'photo', $existing?->photo_path);
        return $this->repository->update($data);
    }

    private function resolveImagePath(array $data, string $prefix, ?string $oldPath = null): array
    {
        $fileKey = "{$prefix}_file";
        $urlKey  = "{$prefix}_url";
        $pathKey = "{$prefix}_path";

        if (!empty($data[$fileKey]) && $data[$fileKey] instanceof UploadedFile) {
            $this->deleteLocalFile($oldPath);
            $path = $data[$fileKey]->store("images/{$prefix}s", 'public');
            $data[$pathKey] = Storage::disk('public')->url($path);
        } elseif (isset($data[$urlKey]) && $data[$urlKey] !== '') {
            $data[$pathKey] = $data[$urlKey];
        }

        unset($data[$fileKey], $data[$urlKey]);
        return $data;
    }

    private function deleteLocalFile(?string $fullUrl): void
    {
        if (!$fullUrl) return;
        $appUrl = rtrim(config('app.url'), '/');
        $storagePrefix = $appUrl . '/storage/';
        if (str_starts_with($fullUrl, $storagePrefix)) {
            $relative = substr($fullUrl, strlen($storagePrefix));
            Storage::disk('public')->delete($relative);
        }
    }
}
