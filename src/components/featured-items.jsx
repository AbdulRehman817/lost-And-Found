import * as React from "react";

import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { Badge } from "../components/ui/badge";

export function FeaturedItems({ items }) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );
  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem key={item.id}>
            <Link href={`/item/${item.id}`} className="group block">
              <Card className="overflow-hidden shadow-lg border-primary/20">
                <CardContent className="relative aspect-[16/9] w-full p-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={item.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <Badge
                      variant={
                        item.status === "Lost" ? "destructive" : "secondary"
                      }
                      className="text-xs font-semibold shadow-lg"
                    >
                      {item.status}
                    </Badge>
                    <h3 className="font-headline text-xl font-semibold text-white mt-2 group-hover:underline">
                      {item.title}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
    </Carousel>
  );
}
