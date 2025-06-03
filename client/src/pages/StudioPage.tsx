import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Import images
import podcastStudioImage from "../assets/images/podcast_studio.jpg";
import studioImages from "../assets/images/studio_features";

// Form schema for the booking form
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(6, { message: "Please enter a valid phone number." }),
  date: z.date({ required_error: "Please select a date." }),
  sessionType: z.enum(["podcast", "video", "both"], { required_error: "Please select a session type." }),
  addons: z.array(z.string()).optional(),
  message: z.string().optional(),
});

// Feature cards data
const studioFeatures = [
  {
    title: "Two-camera setup",
    description: "Professional DSLR cameras with interchangeable lenses",
    imageName: "feature_camera_setup.jpg"
  },
  {
    title: "Two pro podcast mics",
    description: "Broadcast-quality audio capture for crystal clear sound",
    imageName: "feature_podcast_mics.jpg"
  },
  {
    title: "Live camera preview on TV",
    description: "See yourself in real-time while recording",
    imageName: "feature_tv_preview.jpg"
  },
  {
    title: "4K TV for slides/playback",
    description: "Present slide decks or review footage instantly",
    imageName: "feature_presentation_tv.jpg"
  },
  {
    title: "Two-person podcast setup",
    description: "Perfect for interviews and conversations",
    imageName: "feature_interview_setup.jpg"
  },
  {
    title: "Professional lighting rig",
    description: "Look your best with studio-quality lighting",
    imageName: "feature_lighting.jpg"
  },
  {
    title: "Acoustically treated space",
    description: "No echo, no background noise, just perfect audio",
    imageName: "feature_acoustic_panels.jpg"
  },
  {
    title: "On-site studio tech support",
    description: "Expert help with setup and recording",
    imageName: "feature_technician.jpg"
  },
  {
    title: "Editing desk + workspace",
    description: "Comfortable space to review and edit your content",
    imageName: "feature_edit_desk.jpg"
  }
];

// Pricing table data
const pricingOptions = [
  { package: "One-hour session", price: "£60" },
  { package: "Half-day bundle (4 hours)", price: "£200" },
  { package: "Full-day bundle (8 hours)", price: "£350" },
  { package: "Monthly Creator Pass (4x 1hr)", price: "£199/month" }
];

// Benefits list
const benefits = [
  "No DIY setups or echoey home audio",
  "No commute to Oxford or London",
  "Instant content credibility",
  "Walk in with an idea, walk out with content",
  "Friendly tech setup included"
];

export default function StudioPage() {
  // Animation setup
  const sectionRefs = {
    hero: useRef<HTMLElement>(null),
    features: useRef<HTMLElement>(null),
    location: useRef<HTMLElement>(null),
    pricing: useRef<HTMLElement>(null),
    why: useRef<HTMLElement>(null),
    upsell: useRef<HTMLElement>(null),
    booking: useRef<HTMLElement>(null)
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      addons: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    alert("Thank you for your booking request! We'll be in touch shortly.");
    form.reset();
  }

  return (
    <>
      {/* Hero Section */}
      <section 
        ref={sectionRefs.hero}
        className="py-20 relative overflow-hidden fade-in-section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                🎙️ Podcast & Video{" "}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Studio</span>{" "}
                Hire in Banbury
              </h1>
              <h2 className="text-xl md:text-2xl mb-8 text-slate-300 leading-relaxed">
                Broadcast-quality. Acoustically treated. Fully supported.
              </h2>
              <p className="text-lg mb-8 text-slate-300 leading-relaxed">
                Looking for a professional video or podcast studio near Banbury? The Progress Studio is a fully equipped broadcast-quality space — purpose-built for small business owners, creators, and content-first brands who want to sound and look incredible without travelling miles or renting a London setup.
              </p>
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg backdrop-blur-sm mb-8">
                <p className="text-lg mb-2 text-slate-300">
                  <span className="font-bold text-white">Progress clients?</span> You get free studio access every month.
                </p>
                <p className="text-lg text-slate-300">
                  <span className="font-bold text-white">Other businesses?</span> You're more than welcome to book too.
                </p>
              </div>
              <a href="#booking-form">
                <Button 
                  size="lg" 
                  className="px-8 py-4 bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 font-medium text-lg"
                >
                  Book Studio Time
                </Button>
              </a>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 image-container">
              {/* Real studio image */}
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={podcastStudioImage} 
                  alt="Professional Podcast & Video Studio"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={sectionRefs.features}
        id="features" 
        className="py-20 relative overflow-hidden fade-in-section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              What's included in every session
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {studioFeatures.map((feature, index) => {
              // Map feature image name to Cloudinary image URL
              let imageUrl;
              switch(index) {
                case 0: imageUrl = studioImages.camera_setup; break;
                case 1: imageUrl = studioImages.podcast_mics; break;
                case 2: imageUrl = studioImages.camera_preview; break;
                case 3: imageUrl = studioImages.presentation_tv; break;
                case 4: imageUrl = studioImages.interview_setup; break;
                case 5: imageUrl = studioImages.lighting_rig; break;
                case 6: imageUrl = studioImages.acoustic_panels; break;
                case 7: imageUrl = studioImages.technician; break;
                case 8: imageUrl = studioImages.edit_desk; break;
                default: imageUrl = studioImages.camera_setup;
              }
              
              return (
                <Card 
                  key={index} 
                  className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:-translate-y-2 overflow-hidden backdrop-blur-sm"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2 text-white">
                      {feature.title}
                    </h4>
                    <p className="text-slate-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section 
        ref={sectionRefs.location}
        id="location" 
        className="py-20 relative overflow-hidden fade-in-section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-600/50">
                <img 
                  src={studioImages.location_map}
                  alt="Studio Location Map"
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: "350px" }}
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Perfectly located in Banbury
              </h3>
              <p className="text-lg mb-8 text-slate-300 leading-relaxed">
                We're based just off Banbury town centre in Oxfordshire — ideal for businesses from Oxford, Bicester, Leamington Spa, Brackley, and beyond. Free parking available.
              </p>
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                <h4 className="font-semibold mb-3 text-[#7B3FE4]">Address:</h4>
                <p className="text-slate-300 leading-relaxed">
                  Progress Studio<br />
                  123 Business Way<br />
                  Banbury<br />
                  Oxfordshire<br />
                  OX16 1AB
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section 
        ref={sectionRefs.pricing}
        id="pricing" 
        className="py-20 relative overflow-hidden fade-in-section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Studio Hire Rates
            </h3>
            <p className="text-lg mb-8 flex items-center justify-center text-slate-300">
              <span className="text-2xl mr-2">🎁</span>
              Progress Accountants clients get 1 hour of free studio use every month (included in all plans).
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 shadow-lg rounded-xl overflow-hidden backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4]">
                  <TableHead className="text-white font-medium w-2/3">Package</TableHead>
                  <TableHead className="text-white font-medium text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingOptions.map((option, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-slate-800/50" : "bg-slate-700/50"}>
                    <TableCell className="font-medium text-white">{option.package}</TableCell>
                    <TableCell className="text-right font-bold text-[#7B3FE4]">{option.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption className="py-3 text-slate-300">
                All bookings include tech support, lighting, and edit-ready output.
              </TableCaption>
            </Table>
          </div>
        </div>
      </section>

      {/* Why Book With Us Section */}
      <section 
        ref={sectionRefs.why}
        id="why-us" 
        className="py-20 relative overflow-hidden text-white fade-in-section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Why choose the Progress Studio?
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className="text-xl mr-3 mt-1 text-[#7B3FE4]">✓</div>
                <p className="text-lg text-slate-300">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subtle Upsell Block */}
      <section 
        ref={sectionRefs.upsell}
        id="upsell" 
        className="py-20 relative overflow-hidden fade-in-section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-xl shadow-lg p-8 md:p-12 text-center backdrop-blur-sm">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Want it for free?
            </h3>
            <p className="text-lg mb-8 text-slate-300 leading-relaxed">
              Our clients don't just get great financial advice — they also get tools to grow their brand.
              All Progress clients receive 1 hour of free studio time per month, perfect for recording podcasts, sales videos, or expert content.
            </p>
            <a href="/">
              <Button 
                className="px-8 py-4 bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 font-medium text-lg"
              >
                👉 Explore our client plans
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section 
        ref={sectionRefs.booking}
        id="booking-form" 
        className="py-20 relative overflow-hidden fade-in-section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Book your studio session
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                Fill out the form below and we'll get back to you within 24 hours to confirm your booking.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 shadow-lg rounded-xl p-8 backdrop-blur-sm">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Preferred Date & Time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sessionType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Session Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="podcast" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Podcast
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="video" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Video
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="both" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Both
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="addons"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>Add-ons (optional)</FormLabel>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {["Editing support", "Slides preparation", "Not sure yet"].map(
                            (addon) => (
                              <FormField
                                key={addon}
                                control={form.control}
                                name="addons"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={addon}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(addon)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...(field.value || []),
                                                  addon,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== addon
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {addon}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            )
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a bit about what you want to record..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full py-6 bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 font-medium text-lg"
                  >
                    Submit Booking Request
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}