"use client";

import { CircularProgress } from "@nextui-org/progress";
import Image from "next/image";
import { Progress } from "./progress";
import { Card } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./ui/carousel";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { useImageGeneration } from "@/lib/hooks/use-images";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function ResultCarousel() {
  const { images, progress, message } = useImageGeneration();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Card
      className={cn(
        "container flex justify-center w-full aspect-square sm:w-[512px] items-center my-3 p-0 m-0",
        images.length > 0 && progress === 0 && "shadow-none border-none"
      )}
    >
      {progress === 0 ? (
        images.length === 0 ? (
          <div className="text-center w-full flex flex-col gap-3">
            <Icons.media className="m-auto w-20 h-20" />
            <span className="text-lg mt-3 leading-6">
              You have not generated any images yet
            </span>
            <span className="text-muted-foreground mx-5">
              Enter a prompt to generate Interior Design concepts
            </span>
          </div>
        ) : (
          <Carousel setApi={setApi}>
            <CarouselContent>
              {images[0].batch.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={image}
                    alt="Generated Image"
                    width="0"
                    height="0"
                    className="w-full aspect-square rounded-lg shadow-2xl"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>{" "}
            <div className="hidden md:flex">
              <CarouselPrevious />
              <CarouselNext />
            </div>
            <div className="flex justify-center gap-2 p-4">
              {Array.from({ length: images[0].batch.length }).map(
                (_, index) => (
                  <Button
                    variant="default"
                    key={index}
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                      "h-2 w-2 rounded-full p-0",
                      index + 1 === current ? "bg-primary" : "bg-secondary"
                    )}
                  />
                )
              )}
            </div>
          </Carousel>
        )
      ) : (
        <div className="text-center w-full flex flex-col gap-2">
          <Progress progress={progress} message={message} />
        </div>
      )}
    </Card>
  );
}
