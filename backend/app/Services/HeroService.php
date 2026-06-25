<?php

namespace App\Services;

use App\Models\HeroContent;
use App\Repositories\HeroContentRepository;
use App\Services\Concerns\HandlesImageUpload;
use Illuminate\Http\UploadedFile;

class HeroService
{
    use HandlesImageUpload;

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
            $this->deleteImage($oldPath);
            $data[$pathKey] = $this->storeImage($data[$fileKey], "{$prefix}s", $prefix);
        } elseif (isset($data[$urlKey]) && $data[$urlKey] !== '') {
            $data[$pathKey] = $data[$urlKey];
        }

        unset($data[$fileKey], $data[$urlKey]);
        return $data;
    }
}
