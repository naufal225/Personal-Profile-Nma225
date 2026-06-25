<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'title' => 'Contractor',
                'description' => 'Website packages for contractor businesses.',
                'icon' => 'contractor',
                'order' => 1,
                'metadata' => [
                    'tiers' => [
                        [
                            'name' => 'Basic',
                            'price' => 'Rp3,250,000',
                            'recommended' => false,
                            'note' => 'Ideal for contractors who want a professional online presence.',
                            'features' => [
                                'Static company-profile website',
                                'Pages: Home, About, Services, Portfolio, Contact',
                                'WhatsApp contact button',
                                'Mobile responsive',
                                '.com domain for 1 year',
                                'Shared hosting for 1 year',
                                'SSL',
                            ],
                        ],
                        [
                            'name' => 'Professional',
                            'price' => 'Rp5,250,000',
                            'recommended' => true,
                            'note' => 'For contractors who want to manage content independently without a developer.',
                            'features' => [
                                'Everything in Basic, plus:',
                                'Project portfolio CMS',
                                'Self-service project updates',
                                'Dynamic project gallery',
                                'Basic SEO',
                                'Dynamic services page',
                            ],
                        ],
                        [
                            'name' => 'Business',
                            'price' => 'Rp8,250,000',
                            'recommended' => false,
                            'note' => 'A complete solution for mid-to-large scale contractors.',
                            'features' => [
                                'Everything in Professional, plus:',
                                'Quotation inquiry form',
                                'Quote requests sent to the admin email',
                                'Company profile PDF upload',
                                'Multiple services',
                                'Automated form to WhatsApp / admin email',
                            ],
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Clinic',
                'description' => 'Website packages for clinic businesses.',
                'icon' => 'clinic',
                'order' => 2,
                'metadata' => [
                    'tiers' => [
                        [
                            'name' => 'Basic',
                            'price' => 'Rp3,750,000',
                            'recommended' => false,
                            'note' => 'For clinics that want a credible online presence.',
                            'features' => [
                                'Clinic profile',
                                'Pages: Services, Doctors, Maps, Contact',
                                'Domain for 1 year',
                                'Hosting for 1 year',
                                'SSL',
                            ],
                        ],
                        [
                            'name' => 'Professional',
                            'price' => 'Rp5,750,000',
                            'recommended' => true,
                            'note' => 'For clinics that want to actively publish content and doctor information.',
                            'features' => [
                                'Everything in Basic, plus:',
                                'Health article CMS',
                                'Editable doctor schedule',
                                'Service promotions',
                                'Facility gallery',
                            ],
                        ],
                        [
                            'name' => 'Business',
                            'price' => 'Rp8,750,000',
                            'recommended' => false,
                            'note' => 'For clinics that want to accept reservations directly from the website.',
                            'features' => [
                                'Everything in Professional, plus:',
                                'Service reservation booking form',
                                'Email notifications to the admin',
                                "Bookings forwarded to the admin's WhatsApp",
                            ],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
