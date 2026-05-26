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
                'value' => 'github.com/naufal225',
                'url' => 'https://github.com/naufal225',
                'order' => 2,
            ],
            [
                'type' => 'linkedin',
                'label' => 'LinkedIn',
                'value' => 'linkedin.com/in/naufal225',
                'url' => 'https://linkedin.com/in/naufal225',
                'order' => 3,
            ],
            [
                'type' => 'whatsapp',
                'label' => 'WhatsApp',
                'value' => '+62 812-9552-0921',
                'url' => 'https://wa.me/6281295520921',
                'order' => 4,
            ],
        ];

        foreach ($contacts as $contact) {
            Contact::create($contact);
        }
    }
}
