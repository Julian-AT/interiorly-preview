import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Announcement } from "./announcement";

export function Hero() {
  return (
    <div className="space-y-1">
      <Announcement />
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter my-10">
        Interiorly{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          AI
        </span>
      </h1>

      <p className="text-xl text-muted-foreground mb-8">
        ⚡Lightning Fast AI Image Generation
        <br />
        powered by
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-secondary-foreground p-1 text-lg h-auto w-auto inline-flex items-center justify-center gap-1 hover:underline hover:bg-background"
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
            "text-secondary-foreground p-1 text-lg h-auto w-auto inline-flex items-center justify-center gap-1 hover:underline hover:bg-background"
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
  );
}
