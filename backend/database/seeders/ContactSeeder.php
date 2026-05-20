<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    public function run(): void
    {
        $contacts = [
            [
                'type' => 'email',
                'label' => 'Email',
                'value' => 'naufalmarufashrori225@gmail.com',
                'url' => 'mailto:naufalmarufashrori225@gmail.com',
                'order' => 1,
            ],
            [
                'type' => 'github',
                'label' => 'GitHub',
                'value' => 'github.com/naufalmarufashrori',
                'url' => 'https://github.com/naufalmarufashrori',
                'order' => 2,
            ],
            [
                'type' => 'linkedin',
                'label' => 'LinkedIn',
                'value' => 'linkedin.com/in/naufalmarufashrori',
                'url' => 'https://linkedin.com/in/naufalmarufashrori',
                'order' => 3,
            ],
            [
                'type' => 'whatsapp',
                'label' => 'WhatsApp',
                'value' => '+62 812-3456-7890',
                'url' => 'https://wa.me/6281234567890',
                'order' => 4,
            ],
        ];

        foreach ($contacts as $contact) {
            Contact::create($contact);
        }
    }
}
