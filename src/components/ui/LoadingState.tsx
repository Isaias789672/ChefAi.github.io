import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface LoadingStep {
  id: string;
  text: string;
  status: "pending" | "active" | "completed";
}

interface LoadingStateProps {
  steps: LoadingStep[];
  progress: number;
  className?: string;
}

export function LoadingState({ 
  steps,
  progress,
  className 
}: LoadingStateProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Processando...</span>
          <span className="font-semibold text-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-4 p-4 bg-card rounded-2xl border transition-all duration-300",
              step.status === "active" && "border-primary shadow-card",
              step.status === "completed" && "border-success/30 bg-success/5",
              step.status === "pending" && "border-border opacity-60"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Status Icon */}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
              step.status === "active" && "bg-primary/10",
              step.status === "completed" && "bg-success/10",
              step.status === "pending" && "bg-muted"
            )}>
              {step.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : step.status === "active" ? (
                <Loader2 className="w-5 h-5 text-primary spin-slow" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
              )}
            </div>

            {/* Text */}
            <span className={cn(
              "font-medium transition-colors",
              step.status === "completed" && "text-success",
              step.status === "active" && "text-foreground",
              step.status === "pending" && "text-muted-foreground"
            )}>
              {step.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
