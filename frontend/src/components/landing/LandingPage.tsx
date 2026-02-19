import { useState } from 'react';
import { useAuth } from '../../lib/contexts/AuthContext';
import { ArrowRight } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { AgendamentoModal } from './AgendamentoModal';

// Components
import { Header } from './Header';
import { Hero } from './Hero';
import { SocialProof } from './SocialProof';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { Testimonials } from './Testimonials';
import { Pricing } from './Pricing';
import { FAQ } from './FAQ';
import { Footer } from './Footer';

export function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Redirect removed to allow viewing landing page even if logged in
  // Dashboard is accessible via Header button

  if (isLoading) return null; // Avoid flicker

  return (
    <div className="min-h-screen bg-[#faf9f7] font-sans text-[#1F2937]">
      <Header
        onLoginClick={() => setIsLoginModalOpen(true)}
        isAuthenticated={isAuthenticated}
      />

      <main>
        <Hero
          onCtaClick={() => setIsLoginModalOpen(true)}
          onBookingClick={() => setIsBookingModalOpen(true)}
        />
        <SocialProof />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <section className="bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] py-20 text-center text-white">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl" style={{ fontFamily: '"Inter Tight", sans-serif' }}>
              Pronto para transformar sua clínica?
            </h2>
            <p className="mb-8 text-lg text-blue-50 md:text-xl">
              Junte-se a centenas de profissionais que já economizam tempo e aumentam receita.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-[#0EA5E9] shadow-lg transition-transform hover:scale-105"
              >
                Começar teste grátis de 14 dias
              </button>
              <a href="#" className="flex items-center gap-2 font-medium text-white hover:text-blue-100">
                Ou fale com nosso time de vendas <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-6 text-sm text-blue-100">
              Sem cartão. Sem instalação. Sem complicação.
            </p>
          </div>
        </section>
      </main>

      <Footer />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {isBookingModalOpen && (
        <AgendamentoModal onClose={() => setIsBookingModalOpen(false)} />
      )}
    </div>
  );
}
