import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const NoPosts = () => {
  return (
    <Card className="mt-8 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="text-foreground mb-2 text-lg font-semibold">
          No Posts Yet
        </h3>
        <p className="text-muted-foreground text-center">
          Start by adding your first item for sale using the form above.
        </p>
      </CardContent>
    </Card>
  );
};

export default NoPosts;
