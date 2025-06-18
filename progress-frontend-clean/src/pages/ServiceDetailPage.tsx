import { useParams } from "wouter";

export default function ServiceDetailPage() {
  const params = useParams();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Service Details</h1>
        <p className="text-lg text-muted-foreground">
          Service: {params.slug}
        </p>
        <p className="mt-4">
          This is a standalone frontend version. Service details would be loaded from your backend API.
        </p>
      </div>
    </div>
  );
}