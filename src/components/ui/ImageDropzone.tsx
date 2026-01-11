import { useState, useCallback } from "react";
import { Camera, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageDropzoneProps {
  onImageSelect: (file: File) => void;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function ImageDropzone({ 
  onImageSelect, 
  className,
  title = "Arraste uma foto aqui",
  subtitle = "ou clique para selecionar"
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

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
        setPreview(URL.createObjectURL(file));
        onImageSelect(file);
      }
    }
  }, [onImageSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      onImageSelect(file);
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
        const file = target.files[0];
        setPreview(URL.createObjectURL(file));
        onImageSelect(file);
      }
    };
    input.click();
  }, [onImageSelect]);

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-2xl border-2 border-dashed transition-all duration-300 ease-out cursor-pointer overflow-hidden",
          "hover:border-primary hover:bg-accent/50",
          isDragging ? "border-primary bg-accent scale-[1.02]" : "border-border bg-muted/30",
          preview ? "aspect-video" : "aspect-[4/3]"
        )}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-sm font-medium hover:bg-background transition-colors"
            >
              Trocar foto
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-full p-6 cursor-pointer">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
              isDragging ? "bg-primary scale-110" : "bg-accent"
            )}>
              <ImageIcon className={cn(
                "w-7 h-7 transition-colors",
                isDragging ? "text-primary-foreground" : "text-primary"
              )} />
            </div>
            <p className="text-base font-medium text-foreground mb-1">{title}</p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="flex gap-3">
        <label className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-secondary text-secondary-foreground font-medium cursor-pointer hover:bg-secondary/80 transition-colors">
          <Upload className="w-5 h-5" />
          <span>Upload</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
        <button 
          onClick={handleCameraClick}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl gradient-hero text-primary-foreground font-medium hover:opacity-90 transition-opacity shadow-soft"
        >
          <Camera className="w-5 h-5" />
          <span>Câmera</span>
        </button>
      </div>
    </div>
  );
}
