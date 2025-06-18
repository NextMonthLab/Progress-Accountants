const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

console.log('Frontend-only server starting on port', port);

// Single route serves the complete website
app.get('*', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Progress Accountants - Professional Accounting Services in Banbury</title>
    <meta name="description" content="Looking for an accountant in Banbury? Progress Accountants offers expert bookkeeping, tax returns, and business advisory services. Book your free consultation today.">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
    <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
    <script src="https://e40479db-edfd-4265-9a8b-1e462b5725d1-00-290zw6wfwpbn.picard.replit.dev/embed/chatbot.js?id=progress-accountants-uk-chatbot-1750188617452" data-tenant="progress-accountants-uk"></script>
    <style>
        body { 
            font-family: 'Inter', sans-serif; 
            background: #000; 
            color: #fff; 
            margin: 0;
            padding: 0;
        }
        .hero-bg { background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%); }
        .card-bg { background: #1a1a1a; transition: background 0.3s ease; }
        .card-bg:hover { background: #262626; }
        .border-gray { border-color: #333; }
        .btn-primary { 
            background: #fff; 
            color: #000; 
            transition: all 0.3s ease;
        }
        .btn-primary:hover { 
            background: #f0f0f0; 
            transform: translateY(-1px);
        }
        .btn-secondary {
            border: 1px solid #666;
            color: #fff;
            transition: all 0.3s ease;
        }
        .btn-secondary:hover {
            background: #333;
            border-color: #999;
        }
        .nav-link {
            transition: color 0.3s ease;
        }
        .nav-link:hover {
            color: #fff !important;
        }
        .section-spacing {
            padding: 5rem 0;
        }
        @media (max-width: 768px) {
            .section-spacing {
                padding: 3rem 0;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="fixed w-full bg-black/90 backdrop-blur-sm border-b border-gray-800 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="text-2xl font-bold text-white">Progress Accountants</div>
                <div class="hidden md:flex space-x-8">
                    <a href="#home" class="text-gray-300 nav-link">Home</a>
                    <a href="#about" class="text-gray-300 nav-link">About</a>
                    <a href="#services" class="text-gray-300 nav-link">Services</a>
                    <a href="#team" class="text-gray-300 nav-link">Team</a>
                    <a href="#contact" class="text-gray-300 nav-link">Contact</a>
                </div>
                <button onclick="openCalendly()" class="btn-primary px-4 py-2 rounded-lg font-medium">
                    Book Call
                </button>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="pt-20 section-spacing hero-bg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Real Tools for<br><span class="text-gray-300">Business Growth</span>
            </h1>
            <p class="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Looking for an accountant in Banbury? Progress Accountants offers expert bookkeeping, 
                tax returns, and a custom dashboard to grow your business.
            </p>
            <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <button onclick="openCalendly()" class="btn-primary px-8 py-4 rounded-lg font-semibold block w-full sm:w-auto">
                    Book Your Free Call Today
                </button>
                <a href="#services" class="btn-secondary px-8 py-4 rounded-lg font-semibold inline-block w-full sm:w-auto text-center">
                    View Services
                </a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="section-spacing bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-6">About Progress Accountants</h2>
                <p class="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                    Established in 2018, Progress Accountants is a modern accounting firm based in Banbury, 
                    serving businesses across Oxfordshire and beyond. We combine traditional accounting 
                    expertise with cutting-edge technology to deliver exceptional results for our clients.
                </p>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="text-center">
                    <div class="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span class="text-2xl">🎯</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Expert Team</h3>
                    <p class="text-gray-400">Qualified professionals with years of experience</p>
                </div>
                <div class="text-center">
                    <div class="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span class="text-2xl">💼</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Modern Technology</h3>
                    <p class="text-gray-400">Cutting-edge tools and digital solutions</p>
                </div>
                <div class="text-center">
                    <div class="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span class="text-2xl">🚀</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Business Growth</h3>
                    <p class="text-gray-400">Strategic advice to scale your business</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="section-spacing bg-black">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-6">Our Services</h2>
                <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                    Comprehensive accounting solutions tailored to your business needs
                </p>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="card-bg p-8 rounded-lg">
                    <h3 class="text-2xl font-semibold mb-4">Bookkeeping & Accounts</h3>
                    <p class="text-gray-300 mb-6">Professional bookkeeping services to keep your finances organized and compliant with all regulations.</p>
                    <ul class="text-gray-400 space-y-2">
                        <li>• Monthly bookkeeping</li>
                        <li>• Annual accounts preparation</li>
                        <li>• VAT returns</li>
                        <li>• Management accounts</li>
                    </ul>
                </div>
                <div class="card-bg p-8 rounded-lg">
                    <h3 class="text-2xl font-semibold mb-4">Tax Services</h3>
                    <p class="text-gray-300 mb-6">Expert tax preparation and planning services for individuals and businesses of all sizes.</p>
                    <ul class="text-gray-400 space-y-2">
                        <li>• Self-assessment returns</li>
                        <li>• Corporation tax</li>
                        <li>• Tax planning advice</li>
                        <li>• HMRC correspondence</li>
                    </ul>
                </div>
                <div class="card-bg p-8 rounded-lg">
                    <h3 class="text-2xl font-semibold mb-4">Business Advisory</h3>
                    <p class="text-gray-300 mb-6">Strategic business advice and financial planning to help your company grow and succeed.</p>
                    <ul class="text-gray-400 space-y-2">
                        <li>• Business planning</li>
                        <li>• Financial forecasting</li>
                        <li>• Growth strategies</li>
                        <li>• Performance analysis</li>
                    </ul>
                </div>
            </div>
            <div class="text-center mt-12">
                <button onclick="openCalendly()" class="btn-primary px-8 py-4 rounded-lg font-semibold">
                    Book a Consultation
                </button>
            </div>
        </div>
    </section>

    <!-- Team Section -->
    <section id="team" class="section-spacing bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-6">Meet Our Team</h2>
                <p class="text-xl text-gray-300">Experienced professionals dedicated to your success</p>
            </div>
            <div class="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                <div class="text-center">
                    <div class="bg-black w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <span class="text-4xl">👨‍💼</span>
                    </div>
                    <h3 class="text-2xl font-semibold mb-2">Gareth Burton FCA</h3>
                    <p class="text-gray-400 text-lg mb-4">Founder & CEO</p>
                    <p class="text-gray-300 leading-relaxed">
                        Qualified Chartered Accountant with over 15 years of experience in business advisory 
                        and financial management. Gareth specializes in helping SMEs optimize their financial 
                        operations and achieve sustainable growth.
                    </p>
                </div>
                <div class="text-center">
                    <div class="bg-black w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <span class="text-4xl">👩‍💼</span>
                    </div>
                    <h3 class="text-2xl font-semibold mb-2">Becky Rogers</h3>
                    <p class="text-gray-400 text-lg mb-4">Assistant Accountant</p>
                    <p class="text-gray-300 leading-relaxed">
                        Dedicated professional specializing in bookkeeping and client support with 
                        exceptional attention to detail. Becky ensures all client accounts are 
                        maintained to the highest standards.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="section-spacing bg-black">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-4xl font-bold mb-8">Get In Touch</h2>
            <p class="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Ready to take your business to the next level? Contact us today for a consultation.
            </p>
            <div class="grid md:grid-cols-3 gap-8 mb-12">
                <div>
                    <h3 class="text-lg font-semibold mb-2">Email</h3>
                    <p class="text-gray-300">hello@progressaccountants.co.uk</p>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">Phone</h3>
                    <p class="text-gray-300">+44 1295 123456</p>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">Location</h3>
                    <p class="text-gray-300">Banbury, Oxfordshire</p>
                </div>
            </div>
            <button onclick="openCalendly()" class="btn-primary px-8 py-4 rounded-lg font-semibold">
                Book a Free Consultation
            </button>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 border-t border-gray-800 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-lg font-semibold mb-4">Progress Accountants</h3>
                    <p class="text-gray-400">Professional accounting services for modern businesses in Banbury and beyond.</p>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">Services</h3>
                    <ul class="text-gray-400 space-y-2">
                        <li>Bookkeeping</li>
                        <li>Tax Returns</li>
                        <li>Business Advisory</li>
                        <li>Financial Planning</li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">Industries</h3>
                    <ul class="text-gray-400 space-y-2">
                        <li>Film & Media</li>
                        <li>Music Industry</li>
                        <li>Construction</li>
                        <li>Professional Services</li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">Contact</h3>
                    <ul class="text-gray-400 space-y-2">
                        <li>Banbury, Oxfordshire</li>
                        <li>hello@progressaccountants.co.uk</li>
                        <li>+44 1295 123456</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center">
                <p class="text-gray-400">© 2025 Progress Accountants. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        function openCalendly() {
            console.log('Button clicked - opening Calendly');
            if (window.Calendly) {
                Calendly.initPopupWidget({
                    url: 'https://calendly.com/progressaccountants/discovery-call'
                });
            } else {
                // Fallback to direct link
                window.open('https://calendly.com/progressaccountants/discovery-call', '_blank');
            }
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add mobile menu toggle
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Progress Accountants website loaded');
        });
    </script>
</body>
</html>`);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Progress Accountants frontend-only server running on http://0.0.0.0:${port}`);
});