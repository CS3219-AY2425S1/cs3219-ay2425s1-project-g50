import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex items-start justify-center h-2/6">
      <div className="text-center mt-[20vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Loading...
        </h2>
      </div>
    </div>
  );
}
