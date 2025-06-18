import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

interface NoAccessProps {
  title: string;
  message: string;
  returnPath?: string;
  returnLabel?: string;
}

const NoAccess = ({ title, message, returnPath = "/", returnLabel = "Return to Dashboard" }: NoAccessProps) => {
  const [, navigate] = useLocation();

  return (
    <div className="flex items-center justify-center my-12 px-4 py-8">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-xl text-center">{title}</CardTitle>
          <CardDescription className="text-center">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            This feature requires specific platform settings. 
            If you need access, please contact your administrator.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="default" 
            className="w-full" 
            onClick={() => navigate(returnPath)}
          >
            {returnLabel}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoAccess;