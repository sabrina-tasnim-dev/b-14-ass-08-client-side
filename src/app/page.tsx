import { Hero } from "@/components/home/hero";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { Categories } from "@/components/home/categories";
import { HowItWorks } from "@/components/home/how-it-works";
import { HostGuarantee } from "@/components/home/guarantee";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedStudios />
      <Categories />
      <HowItWorks />
      <HostGuarantee />
    </>
  );
}
