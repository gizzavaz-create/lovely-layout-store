import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => { api.off("select", update); api.off("reInit", update); };
  }, [api]);

  return (
    <Carousel opts={{ loop: true }} setApi={setApi} aria-label={`Fotos de ${name}`} className="bg-card">
      <CarouselContent className="ml-0">
        {images.map((src, index) => (
          <CarouselItem key={`${src}-${index}`} className="pl-0" aria-label={`Foto ${index + 1} de ${images.length}`}>
            <img src={src} alt={`${name} — foto ${index + 1}`} loading="lazy" decoding="async" width={600} height={600} className="aspect-square w-full object-contain" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 top-[calc(50%-20px)] h-9 w-9 bg-background/95" aria-label="Foto anterior" title="Foto anterior" />
      <CarouselNext className="right-2 top-[calc(50%-20px)] h-9 w-9 bg-background/95" aria-label="Próxima foto" title="Próxima foto" />
      <div className="flex h-10 items-center justify-center gap-0.5" aria-label="Selecionar foto">
        {images.map((_, index) => (
          <Button key={index} variant="ghost" size="icon" className="h-7 w-6 rounded-full" aria-label={`Ver foto ${index + 1}`} aria-pressed={selected === index} onClick={() => api?.scrollTo(index)}>
            <span className={`h-1.5 w-1.5 rounded-full ${selected === index ? "bg-primary" : "bg-border"}`} />
          </Button>
        ))}
        <span className="ml-1 text-xs tabular-nums text-muted-foreground" aria-live="polite">{selected + 1}/{images.length}</span>
      </div>
    </Carousel>
  );
}