import { useState, useCallback } from "react";
import { Camera, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageDropzoneProps {
  onImageSelect: (file: File) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ImageDropzone({ 
  onImageSelect, 
  title = "Tire uma foto",
  subtitle = "ou selecione da galeria",
  className,
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onImageSelect(file);
      }
    }
  }, [onImageSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelect(e.target.files[0]);
    }
  }, [onImageSelect]);

  const handleCameraClick = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        onImageSelect(target.files[0]);
      }
    };
    input.click();
  }, [onImageSelect]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Dropzone Area */}
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative bg-card rounded-4xl border-2 border-dashed transition-all duration-300 overflow-hidden",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border hover:border-primary/50"
        )}
      >
        <label className="flex flex-col items-center justify-center py-16 px-8 cursor-pointer">
          {/* Icon Container */}
          <div className="relative mb-6">
            <div className={cn(
              "w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300",
              isDragging && "scale-110"
            )}>
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-button">
                <Camera className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            {/* Decorative ring */}
            <div className="absolute -inset-3 rounded-full border-2 border-primary/20 animate-pulse" />
          </div>

          {/* Text */}
          <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{subtitle}</p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleCameraClick}
          className="flex items-center justify-center gap-3 py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-button hover:opacity-90 transition-all active:scale-[0.98]"
        >
          <Camera className="w-5 h-5" />
          <span>Câmera</span>
        </button>
        
        <label className="flex items-center justify-center gap-3 py-4 px-6 bg-card border-2 border-border text-foreground rounded-2xl font-semibold cursor-pointer hover:border-primary/50 hover:bg-accent transition-all active:scale-[0.98]">
          <Upload className="w-5 h-5" />
          <span>Galeria</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileSelect} 
            className="hidden" 
          />
        </label>
      </div>
    </div>
  );
}
