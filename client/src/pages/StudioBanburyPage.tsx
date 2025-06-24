import React from 'react';
import { Helmet } from 'react-helmet';
import { MapPin, Phone, Mail, Clock, Mic, Video, Monitor, Users, Lightbulb, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/ScrollAnimation';

export default function StudioBanburyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>🎙️ Podcast & Video Studio Hire in Banbury | Progress Accountants</title>
        <meta name="description" content="Broadcast-quality. Acoustically treated. Fully supported. Professional podcast and video studio hire in Banbury for small business owners and content creators." />
      </Helmet>

      {/* Gold Standard Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Cinematic Full-Width Background with Smart Focal Points */}
        <div className="absolute inset-0 w-full h-full">
          {/* Desktop/Tablet Background - Adjusted for Head Visibility */}
          <div 
            className="absolute inset-0 w-full h-full hidden sm:block"
            style={{
              backgroundImage: `url('https://res.cloudinary.com/drl0fxrkq/image/upload/v1749048358/IMG_7167_bsq3dc.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 15%',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          />
          
          {/* Mobile Background - Optimal Head Framing */}
          <div 
            className="absolute inset-0 w-full h-full block sm:hidden"
            style={{
              backgroundImage: `url('https://res.cloudinary.com/drl0fxrkq/image/upload/v1749048358/IMG_7167_bsq3dc.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          {/* Dark Overlay for Text Legibility - Gold Standard: 20-50% Opacity */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50"></div>
        </div>

        {/* Content Container - Centered Layout */}
        <div className="relative z-10 w-full px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            
            {/* Gold Standard Headline - 4-8 words per line, max 16 total */}
            <FadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                  style={{
                    textShadow: '0 6px 12px rgba(0,0,0,0.7), 0 3px 6px rgba(0,0,0,0.5)',
                    letterSpacing: '-0.02em'
                  }}>
                <span className="block">Professional Studio.</span>
                <span className="block">Broadcast Quality.</span>
              </h1>
            </FadeIn>

            {/* Gold Standard Subheadline - 18-24 words max, single sentence */}
            <FadeIn delay={0.2}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
                 style={{
                   textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                   letterSpacing: '0.01em'
                 }}>
                Professional podcast and video recording studio in Banbury for content creators.
              </p>
            </FadeIn>

            {/* Gold Standard CTA - Large, centered, outcome-driven */}
            <FadeIn delay={0.3}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/30"
                onClick={() => window.open('https://calendly.com/progressaccountants/discovery-call', '_blank')}
              >
                Book Studio Time
              </Button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Main Intro Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              Professional Content Creation Studio
            </h2>
            <div className="space-y-6 mb-10">
              <p className="text-slate-300 text-lg leading-relaxed">
                Fully equipped, acoustically treated recording space. Professional results without the London trip.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-slate-300">
                  <span>📣</span>
                  <span>Progress clients: 1 hour free monthly studio time.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span>📍</span>
                  <span>Non-clients welcome. Book your session today.</span>
                </div>
              </div>
            </div>
            
            <div className="mb-12">
              <a 
                href="#booking-form" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 font-medium"
              >
                <span>Book Studio Time</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Gallery Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Studio Gallery
              </h2>
              <p className="text-slate-300 text-lg">Professional equipment. Broadcast-quality results.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <div className="relative overflow-hidden rounded-xl shadow-lg group">
                <img 
                  src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1747742830/P1012292-Enhanced-NR_fkrsv2.jpg"
                  alt="Professional podcast recording setup with microphones and acoustic treatment"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="relative overflow-hidden rounded-xl shadow-lg group">
                <img 
                  src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1747742830/P1012291-Enhanced-NR_z1qebv.jpg"
                  alt="Video recording equipment and camera setup in professional studio"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="relative overflow-hidden rounded-xl shadow-lg group">
                <img 
                  src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1747742831/P1012286-Enhanced-NR_h6v6jx.jpg"
                  alt="Acoustic treatment and professional lighting in recording studio"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="relative overflow-hidden rounded-xl shadow-lg group md:col-span-2">
                <img 
                  src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1747742833/P1012283-Enhanced-NR-1_j1bb3j.jpg"
                  alt="Full studio overview showing recording area and professional equipment"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="relative overflow-hidden rounded-xl shadow-lg group">
                <img 
                  src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1747742834/P1012275-Enhanced-NR_cgvg2v.jpg"
                  alt="Detail shot of professional recording equipment and controls"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Professional Equipment & Features
              </h2>
              <p className="text-slate-300 text-lg">What's included in every session:</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-[#7B3FE4]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Two-camera setup</h3>
                <p className="text-slate-300">DSLR cameras with interchangeable lenses</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                  <Mic className="h-6 w-6 text-[#7B3FE4]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Broadcast-quality podcast mics</h3>
                <p className="text-slate-300">Studio-grade audio capture</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                  <Monitor className="h-6 w-6 text-[#7B3FE4]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Real-time camera preview</h3>
                <p className="text-slate-300">On large TV screen</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                  <Monitor className="h-6 w-6 text-[#7B3FE4]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">4K TV for presentations</h3>
                <p className="text-slate-300">For slide presentations or playback</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[#7B3FE4]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Two-person podcast table</h3>
                <p className="text-slate-300">Ideal for interviews and discussions</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-[#7B3FE4]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Studio lighting rig</h3>
                <p className="text-slate-300">Clean, flattering, cinematic lighting</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#7B3FE4]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Acoustically treated room</h3>
                <p className="text-slate-300">No echo, no distractions</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[#7B3FE4]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">On-site tech support</h3>
                <p className="text-slate-300">Help with setup and recording</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                  <Monitor className="h-6 w-6 text-[#7B3FE4]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Editing desk & workspace</h3>
                <p className="text-slate-300">Review, tweak, and export with ease</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Perfectly located in Banbury
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  Located in central Banbury, ideal for businesses in Oxford, Leamington Spa, Bicester, Brackley, and beyond. Free parking included.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mr-4">
                      <MapPin className="h-5 w-5 text-[#7B3FE4]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 mb-2">Address</h3>
                      <div className="text-slate-300">
                        <div className="font-semibold">Progress Studio</div>
                        <div>1st Floor Beaumont House</div>
                        <div>Beaumont Road</div>
                        <div>Banbury</div>
                        <div>OX16 1RH</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-xl shadow-lg h-[400px] bg-slate-800 border border-slate-600/50">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2452.9512290731844!2d-1.3498106233780232!3d52.0620696712133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870bbf9c1ec66d1%3A0x641f85d46eed55d!2sBeaumont%20Rd%2C%20Banbury!5e0!3m2!1sen!2suk!4v1651234567891!5m2!1sen!2suk" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Progress Studio Banbury Map"
                ></iframe>
                <div className="absolute top-3 right-3">
                  <div className="px-3 py-1 bg-slate-800/90 border border-purple-500/30 rounded-md text-xs font-medium text-white shadow-lg">Progress Studio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Rates</h2>
              <div className="flex items-center justify-center gap-2 mb-8">
                <span>🎁</span>
                <p className="text-slate-300 text-lg">Progress Accountants clients get 1 hour of free studio time each month—part of every service plan.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-3">One-hour session</h3>
                <div className="text-3xl font-bold text-[#7B3FE4] mb-4">£60</div>
                <p className="text-slate-300 text-sm">Perfect for quick content creation</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-3">Half-day bundle</h3>
                <div className="text-3xl font-bold text-[#7B3FE4] mb-4">£200</div>
                <p className="text-slate-300 text-sm">4 hours of studio time</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-3">Full-day bundle</h3>
                <div className="text-3xl font-bold text-[#7B3FE4] mb-4">£350</div>
                <p className="text-slate-300 text-sm">8 hours of studio time</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border-purple-500/50">
                <h3 className="text-xl font-semibold text-white mb-3">Monthly Creator Pass</h3>
                <div className="text-3xl font-bold text-[#7B3FE4] mb-4">£199<span className="text-sm text-slate-400">/month</span></div>
                <p className="text-slate-300 text-sm">4x1h sessions per month</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-slate-300">All bookings include studio lighting, tech support, and edit-ready output.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Why Choose the Progress Studio?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <Check className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-300 text-lg">No DIY setups or dodgy sound</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <Check className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-300 text-lg">No travel to Oxford or London</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <Check className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-300 text-lg">Instant content credibility</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <Check className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-300 text-lg">Walk in with an idea—walk out with finished content</p>
                </div>
              </div>

              <div className="flex items-start md:col-span-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <Check className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-300 text-lg">Tech help always included</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Access Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Want it for Free?
            </h2>
            <div className="space-y-6 mb-10">
              <p className="text-slate-300 text-lg leading-relaxed">
                Our clients don't just get expert financial advice—they get tools to grow.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed">
                Every Progress client receives 1 hour of free studio access monthly—ideal for podcasts, explainer videos, or marketing content.
              </p>
            </div>
            
            <div className="mb-12">
              <a 
                href="/services" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 font-medium"
              >
                <span>👉 Explore our Client Plans</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-form" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Book Your Studio Session</h2>
              <p className="text-slate-300 text-lg">
                Fill in the form and we'll confirm your booking within 24 hours.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-8 rounded-xl shadow-lg backdrop-blur-sm">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="datetime" className="block text-sm font-medium text-slate-300 mb-2">
                      Preferred Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      id="datetime"
                      name="datetime"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="session-type" className="block text-sm font-medium text-slate-300 mb-2">
                      Session Type
                    </label>
                    <select
                      id="session-type"
                      name="session-type"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    >
                      <option value="">Select session type</option>
                      <option value="podcast">Podcast</option>
                      <option value="video">Video</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="addons" className="block text-sm font-medium text-slate-300 mb-2">
                      Add-ons (optional)
                    </label>
                    <select
                      id="addons"
                      name="addons"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    >
                      <option value="">Select add-ons</option>
                      <option value="editing">Editing Support</option>
                      <option value="slides">Slides Prep</option>
                      <option value="not-sure">Not Sure Yet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Message: What would you like to record?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
                    placeholder="Tell us about your project and what you'd like to record..."
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 font-medium"
                  >
                    <span>Submit Booking Request</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Studio Image Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Create Something Amazing?
              </h3>
              <p className="text-slate-300 text-lg">
                Professional studio environment designed for content creators and business owners
              </p>
            </div>
            
            <div className="relative overflow-hidden rounded-xl shadow-2xl mx-auto">
              <img 
                src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1749048359/IMG_8542_qv70ds.jpg"
                alt="Complete studio setup showing professional recording environment and equipment arrangement"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <p className="text-white text-lg font-medium">
                  Book your session today and bring your content vision to life
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}