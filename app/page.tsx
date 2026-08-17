import { FounderBlock } from "@/components/FounderBlock";
import { AccessRequestForm } from "@/components/AccessRequestForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { CertificateSection } from "@/components/CertificateSection";
import { CourseCatalog } from "@/components/sections/CourseCatalog";
import { FAQ } from "@/components/sections/FAQ";
import { ForWhom } from "@/components/sections/ForWhom";
import { LearningFlow } from "@/components/sections/LearningFlow";
import { Benefits } from "@/components/sections/Benefits";
import { WorkEnvironment } from "@/components/sections/WorkEnvironment";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <main>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <Header />
      <Hero />
      <ForWhom />
      <CourseCatalog />
      <LearningFlow />
      <Benefits />
      <CertificateSection />
      <FounderBlock />
      <WorkEnvironment />
      <AccessRequestForm />
      <FAQ />
      <Footer />
    </main>
  );
}
