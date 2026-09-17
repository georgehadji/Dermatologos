import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import DoctorIntro from "@/components/sections/DoctorIntro";
import ConditionsGrid from "@/components/sections/ConditionsGrid";
import VisitSteps from "@/components/sections/VisitSteps";
import ClinicGallery from "@/components/sections/ClinicGallery";
import ArticleTeasers from "@/components/sections/ArticleTeasers";
import Reviews from "@/components/sections/Reviews";
import ContactBlock from "@/components/sections/ContactBlock";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <DoctorIntro />
        <ConditionsGrid limit={6} />
        <VisitSteps />
        <ClinicGallery />
        <ArticleTeasers limit={3} />
        <Reviews />
        <ContactBlock />
      </main>
      <Footer />
    </>
  );
}
