import { Gallery } from "@/components/gallery";
import { GenerationForm } from "@/components/generation-form";
import { Hero } from "@/components/hero";
import ResultCarousel from "@/components/result-carousel";

export default function Home() {
  return (
    <>
      <div className="container py-10">
        <div className="flex flex-col gap-5 items-center justify-center text-center">
          <Hero />
          <GenerationForm />
          <ResultCarousel />
          <Gallery />
        </div>
      </div>
    </>
  );
}
