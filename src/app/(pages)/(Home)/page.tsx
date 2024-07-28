import CallToActionSection from './_components/CallToActionSection';
import FeaturesSection from './_components/FeaturesSection';
import HeroSection from './_components/HeroSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <main className="container mx-auto px-4 py-14">
        <HeroSection />
        <FeaturesSection />
        <CallToActionSection />
      </main>
    </div>
  );
}
