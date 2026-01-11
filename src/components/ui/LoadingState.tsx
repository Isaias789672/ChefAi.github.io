import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  className?: string;
}

export function LoadingState({ 
  message = "Analisando sua foto...", 
  submessage = "Nossa IA está identificando os ingredientes",
  className 
}: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6", className)}>
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center animate-pulse">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
      </div>
      
      <div className="mt-6 text-center">
        <p className="font-semibold text-lg text-foreground flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          {message}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{submessage}</p>
      </div>

      <div className="mt-8 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
