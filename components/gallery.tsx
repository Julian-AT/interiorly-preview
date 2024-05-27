"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useImageGeneration } from "@/lib/hooks/use-images";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import moment from "moment";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function Gallery() {
  const { images, isPending, clearImages } = useImageGeneration();

  return (
    <div className="container md:mx-3 2xl:mx-1 p-0">
      <div className="flex justify-center sm:justify-between w-full">
        <div className="flex gap-2 items-baseline flex-col">
          <span className="text-3xl font-bold">Gallery</span>
          <span className="text-sm text-muted-foreground hidden md:flex">
            Contains all the images you have generated
          </span>
        </div>
        <Button
          variant={"outline"}
          className="h-full my-auto hidden sm:flex"
          onClick={clearImages}
          disabled={images.length === 0}
        >
          Clear Gallery
        </Button>
      </div>
      <Separator className="h-0.5 bg-secondary my-3" />
      <div className="flex flex-col gap-4 p-0 m-0 w-full h-full">
        {isPending ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="lg:grid-cols-4 grid-cols-2 gap-4 grid h-80"
            >
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} className="w-full h-full rounded-xl" />
              ))}
            </div>
          ))
        ) : images.length === 0 ? (
          <span className="line-clamp-1 w-full md:text-lg my-2 font-semibold tracking-normal antialiased text-secondary-foreground/80">
            You have not generated any images yet
          </span>
        ) : (
          images.map((imageBatch, index) => (
            <div
              className="flex flex-col text-start"
              key={imageBatch.timestamp}
            >
              <span className="line-clamp-1 w-full md:text-lg my-2 font-semibold tracking-normal antialiased uppercase text-secondary-foreground/80">
                {imageBatch.prompt}
              </span>
              <div className="lg:grid-cols-4 grid-cols-2 gap-4 grid">
                {imageBatch.batch.map((image, index) => (
                  <div key={image.slice(-10)}>
                    <div className="flex md:hidden">
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Image
                            key={index}
                            src={image}
                            alt="Generated Image"
                            width="0"
                            height="0"
                            className="w-full h-auto rounded-lg shadow-2xl"
                          />
                        </DrawerTrigger>
                        <DrawerContent>
                          <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                              <DrawerTitle>{imageBatch.prompt}</DrawerTitle>
                              <DrawerDescription>
                                Generated{" "}
                                {moment(imageBatch.timestamp).fromNow()}
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 pb-0">
                              <div className="">
                                <Image
                                  key={index}
                                  src={image}
                                  alt="Generated Image"
                                  width="0"
                                  height="0"
                                  className="w-full h-auto rounded-lg shadow-2xl"
                                />
                              </div>
                            </div>
                            <DrawerFooter>
                              <DrawerClose asChild>
                                <a
                                  className={buttonVariants({
                                    variant: "outline",
                                  })}
                                  href={image}
                                  download={`${imageBatch.prompt}.png`}
                                >
                                  Download
                                </a>
                              </DrawerClose>
                            </DrawerFooter>
                          </div>
                        </DrawerContent>
                      </Drawer>
                    </div>
                    <div className="hidden md:flex">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Image
                            key={index}
                            src={image}
                            alt="Generated Image"
                            width="0"
                            height="0"
                            className="w-full h-auto rounded-lg shadow-2xl hover:cursor-pointer"
                          />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="mr-3">
                              {imageBatch.prompt}
                            </DialogTitle>
                            <DialogDescription>
                              Generated {moment(imageBatch.timestamp).fromNow()}
                            </DialogDescription>
                          </DialogHeader>
                          <Image
                            key={index}
                            src={image}
                            alt="Generated Image"
                            width="0"
                            height="0"
                            className="w-full h-auto rounded-lg shadow-2xl"
                          />
                          <DialogFooter>
                            <a
                              className={buttonVariants({ variant: "outline" })}
                              href={image}
                              download={`${imageBatch.prompt}.png`}
                            >
                              Download
                            </a>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
