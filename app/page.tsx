"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Autoplay from "embla-carousel-autoplay";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import z from "zod";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type SocketMessage = {
  msg: string;
  rank?: number;
  output?: {
    error?: string;
    data?: [string[]];
  };
  avg_event_concurrent_process_time?: number;
  avg_event_process_time?: number;
  queue_size?: number;
  rank_eta?: number;
  queue_eta?: number;
  success?: boolean;
};

const DEFAULT_PROMPT_EMBEDDING = "Interior Design, Home Decor, Architecture";

const DEFAULT_PROMPTS = [
  "A modern and spacious kitchen with natural light",
  "An elegant and contemporary bathroom with marble finishes",
  "A cozy and modern bedroom with minimalist decor",
  "A luxurious and modern dining room with large windows",
  "A stylish and elegant home office with sleek furniture",
  "A contemporary living room with bold art pieces",
  "A modern balcony with comfortable seating and city views",
  "A sleek and modern home bar with ambient lighting",
  "A sophisticated and elegant guest room with fine linens",
  "A modern and chic media room with state-of-the-art technology",
  "An elegant and minimalist entryway with clean lines",
  "A luxurious and contemporary master suite with spa-like bathroom",
  "A cozy and modern breakfast nook with banquette seating",
  "A stylish and modern outdoor patio with fire pit",
  "A contemporary and elegant library with floor-to-ceiling bookshelves",
  "A minimalist and modern rooftop terrace with panoramic views",
  "An elegant and modern nursery with soft, neutral tones",
];

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [images, setImages] = useState<string[][]>([]);
  const [progress, setProgress] = useState<number>(0);
  const BASEURL = `wss://google-sdxl.hf.space/queue/join`;
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  let startTime: null | number = null;

  const generateImage = (prompt: string, retries: number = 0) => {
    setProgress(0);
    setIsLoading(true);
    const session_hash = Math.random().toString(36).substring(2);
    const ws = new WebSocket(BASEURL);

    let etaReached = false;
    let estimatedEta = 0;

    const updateProgressBasedOnTime = (eta: number, startTime: number) => {
      if (etaReached) return;

      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTime) / 1000;
      if (elapsedTime >= eta) {
        etaReached = true;
        setProgress(90);
        return;
      }

      let timeProgress = (elapsedTime / eta) * 40;

      setProgress(50 + timeProgress);

      const randomDelay = Math.random() * (1000 - 500) + 250;

      setTimeout(() => updateProgressBasedOnTime(eta, startTime), randomDelay);
    };

    ws.onopen = () => {
      if (retries === 0) setMessage("Connecting to the server...");
    };

    ws.onmessage = (event) => {
      const message: SocketMessage = JSON.parse(event.data);
      switch (message.msg) {
        case "send_hash":
          if (retries === 0)
            setMessage(
              "Successfully connected to the server. Preparing to send data..."
            );
          ws.send(JSON.stringify({ fn_index: 3, session_hash }));
          break;
        case "estimation":
          setMessage(
            `You're currently in queue position ${message.rank || 0 + 1}.`
          );
          if (
            (!message.rank && message.rank !== 0) ||
            !message.queue_size ||
            !message.avg_event_process_time
          )
            return console.error("Invalid message", message);

          if (message.rank > 0) {
            const queueProgress = (1 - message.rank / message.queue_size) * 50;
            estimatedEta = message.avg_event_process_time;
            setProgress(queueProgress);
          }
          break;
        case "send_data":
          setMessage(
            "Uploading data to the server for processing. This may take a few moments..."
          );
          ws.send(
            JSON.stringify({
              data: [
                prompt + DEFAULT_PROMPT_EMBEDDING,
                "",
                7.5,
                "Photographic",
              ],
              event_data: null,
              fn_index: 3,
              session_hash,
            })
          );
          break;
        case "process_starts":
          const startTime = Date.now();

          if (estimatedEta > 0) {
            updateProgressBasedOnTime(estimatedEta, startTime);
          }
          setMessage("Your request is being processed...");
          break;
        case "process_completed":
          setProgress(100);
          if (!message.success || !message.output?.data)
            return setMessage(
              "An error occurred while processing your request. " +
                message.output?.error
            );
          const resultImages = message.output?.data[0] || [];
          setMessage("Your images have been successfully generated!");
          setImages((prev) => [...prev, [...resultImages]]);
          setTimeout(() => setProgress(0), 250);
          break;
        case "queue_full":
          if (retries < 5) {
            retries += 1;
            setMessage(`The queue is currently full. Retrying... (${retries})`);
            setTimeout(() => {
              generateImage(prompt, retries);
            }, 250);
          } else {
            setMessage("The queue is currently full. Please try again later.");
          }
          break;
        default:
          setMessage("Received an unrecognized response from the server.");
      }
    };

    ws.onclose = () => {
      setIsLoading(false);
    };

    ws.onerror = (error) => {
      setMessage(`Websocket error: ${error}`);
      ws.close();
    };
  };

  const formSchema = z.object({
    prompt: z.string().min(2, {
      message: "Your prompt is too short",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt:
        DEFAULT_PROMPTS[Math.floor(Math.random() * DEFAULT_PROMPTS.length)],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    generateImage(values.prompt);
  }

  return (
    <>
      <div className="h-2/3 flex flex-col m">
        <div className="bg-gray-1000 pt-12">
          <div className="container px-4">
            <div className="grid gap-4 sm:gap-6 items-center justify-center text-center">
              <div className="space-y-1">
                <h1
                  className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
                  data-aos="zoom-y-out"
                >
                  Interiorly{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                    AI Preview
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground mb-8">
                  ⚡Lightning Fast AI Image Generation
                  <br />
                  powered by
                  <Link
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "text-secondary-foreground p-1 text-base h-auto w-auto inline-flex items-center justify-center gap-1 hover:underline hover:bg-background"
                    )}
                    href={"https://huggingface.co/spaces/google/sdxl"}
                  >
                    {" "}
                    SDXL
                  </Link>
                  running on
                  <Link
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "text-secondary-foreground p-1 text-base h-auto w-auto inline-flex items-center justify-center gap-1 hover:underline hover:bg-background"
                    )}
                    href={
                      "https://cloud.google.com/blog/products/compute/announcing-cloud-tpu-v5e-and-a3-gpus-in-ga"
                    }
                  >
                    {" "}
                    Google Cloud TPU v5e
                  </Link>
                </p>
              </div>
              <div className="max-w-xl w-full mx-auto px-3">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3 "
                  >
                    <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Elegant living room with a modern touch"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      Generate&nbsp;
                      {isLoading && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
              {message && (
                <span className="w-full text-center mx-auto">{message}</span>
              )}
              {progress > 0 && <Progress value={progress} />}
            </div>
          </div>
        </div>
        {images.length > 0 ? (
          <>
            <div className="container my-5 w-[512px] h-[512px]">
              <Carousel
                className="w-full h-full"
                plugins={[
                  Autoplay({
                    delay: 5000,
                  }),
                ]}
                setApi={setApi}
              >
                <CarouselContent>
                  {images[images.length - 1].reverse().map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Image
                          src={image}
                          alt="Generated Image"
                          width="0"
                          height="0"
                          className="w-full h-auto rounded-lg shadow-2xl"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:flex">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
                <div className="flex justify-center space-x-2 py-2">
                  {Array.from({ length: count }).map((_, index) => (
                    <button
                      key={index}
                      aria-label={`Go to slide ${index + 1}`}
                      className={`h-2 w-2 rounded-full ${
                        index + 1 === current ? "bg-primary" : "bg-muted"
                      }`}
                      onClick={() => api?.scrollTo(index - 1)}
                    />
                  ))}
                </div>
              </Carousel>
            </div>
            <div className="container py-3">
              <div className="flex justify-between">
                <h2 className="text-2xl font-bold text-center">
                  Generated Images
                </h2>
                <Button variant={"ghost"} onClick={() => setImages([])}>
                  Clear History
                </Button>
              </div>
              <Separator className="my-1" />
              <div className="flex flex-col gap-6 py-6">
                {images.map((batch, index) => (
                  <div
                    className="flex items-center justify-center space-x-6"
                    key={index}
                  >
                    {batch.map((image, i) => (
                      <div key={i}>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Image
                              src={image}
                              alt="Generated Image"
                              width="0"
                              height="0"
                              sizes="100vw"
                              className="w-64 h-auto hover:cursor-pointer"
                            />
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <Image
                              src={image}
                              alt="Generated Image"
                              width="0"
                              height="0"
                              sizes="100vw"
                              className="w-full h-auto p-3 rounded-lg shadow-2xl"
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-muted-foreground container w-full flex flex-col py-32 items-center gap-3">
            <Icons.media className="w-20 h-20" />
            <span className="text-xl">
              You have not generated any images yet.
            </span>
          </div>
        )}
      </div>
    </>
  );
}
