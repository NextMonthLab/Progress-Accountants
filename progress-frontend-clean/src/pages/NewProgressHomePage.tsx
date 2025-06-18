import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Play, ArrowRight, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";

export default function NewProgressHomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Navigation */}
      <nav className="bg-black/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Progress</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/"><span className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors">Home</span></Link>
              <Link href="/studio"><span className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors">Video</span></Link>
              <Link href="/services"><span className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors">Experience</span></Link>
              <Link href="/network"><span className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors">Networking</span></Link>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 px-6 py-2">
                Request Invite
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 rounded-lg mt-2">
                <Link href="/"><span className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>Home</span></Link>
                <Link href="/studio"><span className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>Video</span></Link>
                <Link href="/services"><span className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>Experience</span></Link>
                <Link href="/network"><span className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>Networking</span></Link>
                <div className="pt-4">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600">
                    Request Invite
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Event Card */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Event Card */}
            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-0 text-white overflow-hidden">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Exclusive Business Growth Event</h2>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                      <Calendar className="h-5 w-5 mx-auto mb-2" />
                      <div className="text-sm font-medium">Thursday</div>
                      <div className="text-xs opacity-90">19th June</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                      <Clock className="h-5 w-5 mx-auto mb-2" />
                      <div className="text-sm font-medium">3-7pm</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                      <MapPin className="h-5 w-5 mx-auto mb-2" />
                      <div className="text-sm font-medium">Banbury</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h1 className="text-5xl font-bold text-white mb-4">
                  Unlock Growth in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">2025</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                  Strategy, Technology, and Financial Insight for Ambitious Businesses
                </p>
                <p className="text-gray-400 mb-8">
                  An exclusive invite-only event hosted by Progress Accountants for ambitious business owners and leaders within 40km of Banbury, or those in our specialist sectors (Construction, Film, Music, Property).
                </p>
              </div>
            </div>

            {/* Right Side - Image placeholder */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-medium">Event Highlights</p>
                  <p className="text-sm opacity-75">Watch our preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Cards Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Growth Room VR */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10 overflow-hidden group hover:bg-black/60 transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Play className="h-6 w-6" />
                    </div>
                    <p className="text-sm">VR Experience</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Growth Room VR</h3>
                <p className="text-gray-300 mb-4">
                  Step into our virtual Growth Room and explore innovative tools, including the Business Finance Dashboard and Growth Calculator.
                </p>
                <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
                  Interactive Experience
                </Button>
              </CardContent>
            </Card>

            {/* Strategy Workshop */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10 overflow-hidden group hover:bg-black/60 transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6" />
                    </div>
                    <p className="text-sm">Live Workshop</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Strategy Workshop</h3>
                <p className="text-gray-300 mb-4">
                  Join our interactive workshop "Five Steps to Future-Proof Your Business" with actionable insights.
                </p>
                <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                  Live Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Invitation Request Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Left Side - Information */}
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6">Request Your Invitation</h2>
              <p className="text-gray-300 mb-8">
                Spaces are limited. If you're future-focused, we'd love to hear from you. We'll personally review every request.
              </p>
              
              <Card className="bg-black/40 backdrop-blur-sm border-white/10 mb-8">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-yellow-400 text-sm">⚡</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Our Event Is In High Demand</h3>
                      <p className="text-gray-300 text-sm">
                        Priority will be given to local business owners with growth ambitions and those in our specialist sectors.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="aspect-video bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-lg backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Play className="h-6 w-6" />
                  </div>
                  <p className="text-sm">Event Preview</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-6">Ready to attend our exclusive event?</h3>
                <p className="text-gray-300 mb-8">
                  Complete your invitation request in our secure form. Progress Accountants will review all applications and contact you with next steps.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-purple-400 text-xs">✓</span>
                    </div>
                    <span className="text-gray-300">Limited to 100 attendees</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Clock className="h-3 w-3 text-blue-400" />
                    </div>
                    <span className="text-gray-300">Arrive between 3:00-6:00 PM</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Users className="h-3 w-3 text-purple-400" />
                    </div>
                    <span className="text-gray-300">Live networking & presentations</span>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3">
                  Request Your Invitation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Opens our secure invitation request form
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}