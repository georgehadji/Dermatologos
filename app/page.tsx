import Nav from "@/components/Nav";
import Preloader from "@/components/Preloader";
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
      {/*
        Homepage only. The intro sets the tone for someone arriving at the
        practice; on an article or a condition page it is a curtain between the
        visitor and the answer they came for.
      */}
      <Preloader />
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
