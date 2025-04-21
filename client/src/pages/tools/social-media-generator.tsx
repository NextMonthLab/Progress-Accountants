import React from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import SocialMediaPostGenerator from "@/components/tools/SocialMediaGenerator/SocialMediaPostGenerator";

const SocialMediaGeneratorPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Universal Social Media Post Generator | Progress Accountants</title>
        <meta
          name="description"
          content="Generate optimized social media posts for any platform with our AI-powered tool."
        />
      </Helmet>

      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Universal Social Media Post Generator</h1>
        <p className="text-muted-foreground mb-8">
          Create platform-optimized posts with AI-generated captions and images.
        </p>

        <SocialMediaPostGenerator />
      </div>
    </>
  );
};

export default SocialMediaGeneratorPage;