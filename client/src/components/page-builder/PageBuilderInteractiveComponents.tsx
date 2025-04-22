import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

// Form Component
interface FormField {
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface FormComponentProps {
  content: {
    title: string;
    description: string;
    fields: FormField[];
    submitText: string;
    successMessage: string;
    errorMessage: string;
    emailTarget: string;
  };
  isEditing?: boolean;
  onUpdate?: (updatedContent: any) => void;
}

export const FormComponent: React.FC<FormComponentProps> = ({ 
  content, 
  isEditing = false,
  onUpdate
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) {
      alert(content.successMessage || "Form submitted successfully!");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        {content.description && <CardDescription>{content.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {content.fields.map((field, index) => (
            <div key={index} className="space-y-2">
              <label 
                htmlFor={`field-${index}`} 
                className="text-sm font-medium"
              >
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {field.type === 'text' && (
                <Input 
                  id={`field-${index}`}
                  placeholder={field.placeholder || ''}
                  disabled={!isEditing}
                  required={field.required}
                />
              )}

              {field.type === 'email' && (
                <Input 
                  id={`field-${index}`}
                  type="email"
                  placeholder={field.placeholder || ''}
                  disabled={!isEditing}
                  required={field.required}
                />
              )}

              {field.type === 'tel' && (
                <Input 
                  id={`field-${index}`}
                  type="tel"
                  placeholder={field.placeholder || ''}
                  disabled={!isEditing}
                  required={field.required}
                />
              )}

              {field.type === 'textarea' && (
                <Textarea 
                  id={`field-${index}`}
                  placeholder={field.placeholder || ''}
                  disabled={!isEditing}
                  required={field.required}
                />
              )}

              {field.type === 'select' && field.options && (
                <Select disabled={!isEditing}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option, optIndex) => (
                      <SelectItem key={optIndex} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
          
          <Button type="submit" className="w-full">
            {content.submitText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Map Component
interface MapMarker {
  lat: number;
  lng: number;
  title: string;
}

interface MapComponentProps {
  content: {
    address: string;
    title: string;
    description: string;
    height: number;
    showControls: boolean;
    zoom: number;
    markers: MapMarker[];
  };
  isEditing?: boolean;
  onUpdate?: (updatedContent: any) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  content, 
  isEditing = false,
  onUpdate
}) => {
  // In a real implementation, this would integrate with a mapping service
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        {content.description && <CardDescription>{content.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div 
          className="relative bg-gray-200 rounded-md flex items-center justify-center"
          style={{ height: `${content.height}px` }}
        >
          {isEditing ? (
            <div className="text-center p-6">
              <p className="mb-2 text-muted-foreground">Map Preview (Google Maps will display here)</p>
              <p className="font-medium">Address: {content.address}</p>
              <div className="mt-4">
                {content.markers.map((marker, idx) => (
                  <div key={idx} className="text-sm">
                    Marker {idx + 1}: {marker.title} ({marker.lat}, {marker.lng})
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-6">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
              <p className="font-medium text-lg">{content.address}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Map loading... If this were connected to Google Maps, you would see the location here.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Accordion Component
interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionComponentProps {
  content: {
    title: string;
    items: AccordionItem[];
    allowMultiple: boolean;
  };
  isEditing?: boolean;
  onUpdate?: (updatedContent: any) => void;
}

export const AccordionComponent: React.FC<AccordionComponentProps> = ({ 
  content, 
  isEditing = false,
  onUpdate
}) => {
  return (
    <div className="w-full">
      {content.title && <h3 className="text-xl font-semibold mb-4">{content.title}</h3>}
      
      <Accordion type={content.allowMultiple ? "multiple" : "single"} collapsible>
        {content.items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>
              <div className="prose max-w-none dark:prose-invert">
                {item.content}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};