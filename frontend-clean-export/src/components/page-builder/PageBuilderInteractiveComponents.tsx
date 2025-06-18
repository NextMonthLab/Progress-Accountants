import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CheckCircle2, MapPin } from "lucide-react";

// Form Component
export const FormComponent: React.FC<{ content: any }> = ({ content }) => {
  const {
    title = "Contact Form",
    description = "Fill out the form below and we'll get back to you.",
    fields = [
      { type: "text", label: "Name", required: true, placeholder: "Your name" },
      { type: "email", label: "Email", required: true, placeholder: "your.email@example.com" },
      { type: "textarea", label: "Message", required: true, placeholder: "How can we help you?" }
    ],
    submitText = "Send Message",
    successMessage = "Thank you! Your message has been sent successfully.",
    errorMessage = "Something went wrong. Please try again later."
  } = content;

  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This is just for preview purposes
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="mt-3 text-lg font-medium">Form Submitted Successfully</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {successMessage}
          </p>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => setSubmitted(false)}
          >
            Reset Form
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field: any, index: number) => (
            <div key={index} className="space-y-1">
              <Label htmlFor={`field-${index}`}>{field.label} {field.required && <span className="text-destructive">*</span>}</Label>
              
              {field.type === "text" && (
                <Input 
                  id={`field-${index}`} 
                  placeholder={field.placeholder} 
                  required={field.required} 
                />
              )}
              
              {field.type === "email" && (
                <Input 
                  id={`field-${index}`} 
                  type="email" 
                  placeholder={field.placeholder} 
                  required={field.required} 
                />
              )}
              
              {field.type === "tel" && (
                <Input 
                  id={`field-${index}`} 
                  type="tel" 
                  placeholder={field.placeholder} 
                  required={field.required} 
                />
              )}
              
              {field.type === "textarea" && (
                <Textarea 
                  id={`field-${index}`} 
                  placeholder={field.placeholder} 
                  required={field.required} 
                />
              )}
              
              {field.type === "select" && (
                <Select>
                  <SelectTrigger id={`field-${index}`}>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option: string, i: number) => (
                      <SelectItem key={i} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
          
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : submitText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Map Component
export const MapComponent: React.FC<{ content: any }> = ({ content }) => {
  const {
    address = "123 Main Street, Anytown, CA 12345",
    title = "Our Location",
    description = "We're located in the heart of downtown.",
    height = 400,
    zoom = 14,
    markers = [
      {
        lat: 37.7749, 
        lng: -122.4194,
        title: "Our Office"
      }
    ]
  } = content;

  // In a real implementation, we'd use a mapping library like Google Maps or Mapbox
  // For preview purposes, we'll show a placeholder with the address info
  return (
    <Card className="w-full overflow-hidden">
      {title && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <div 
        className="flex flex-col items-center justify-center bg-secondary/20" 
        style={{ height: `${height}px` }}
      >
        <div className="bg-background p-4 rounded-lg shadow-md max-w-md w-full m-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">Address</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{address}</p>
            </div>
          </div>
          <div className="mt-3 text-sm text-center text-muted-foreground italic">
            In published view, an interactive map will be displayed here.
          </div>
          <Button className="w-full mt-3" variant="outline" size="sm">
            Get Directions
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Accordion Component
export const AccordionComponent: React.FC<{ content: any }> = ({ content }) => {
  const {
    title = "Frequently Asked Questions",
    items = [
      { 
        title: "How do I get started?", 
        content: "Getting started is easy! Simply register for an account and follow the onboarding process." 
      },
      { 
        title: "What payment methods do you accept?", 
        content: "We accept all major credit cards, PayPal, and bank transfers." 
      },
      { 
        title: "Do you offer refunds?", 
        content: "Yes, we offer a 30-day money-back guarantee on all our services." 
      }
    ],
    allowMultiple = false
  } = content;

  return (
    <Card className="w-full">
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <Accordion type={allowMultiple ? "multiple" : "single"} collapsible>
          {items.map((item: any, index: number) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};