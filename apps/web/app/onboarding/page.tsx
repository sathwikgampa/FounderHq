'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StepVision } from '@/components/onboarding/step-vision';
import { StepDomain } from '@/components/onboarding/step-domain';
import { AgentInitialization } from '@/components/onboarding/agent-initialization';
import { OrbitBackground } from '@/components/ui/orbit-background';

type OnboardingStep = 'VISION' | 'DOMAIN' | 'INIT';

interface StartupData {
  name: string;
  tagline: string;
  industry: string;
  targetMarket: string;
}

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>('VISION');
  const [data, setData] = useState<StartupData>({
    name: '',
    tagline: '',
    industry: '',
    targetMarket: '',
  });

  const updateData = (newData: Partial<StartupData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <div className="min-h-screen bg-[#030304] flex items-center justify-center p-6 relative overflow-hidden">
      <OrbitBackground />

      {/* Dark overlay to make form pop */}
      <div className="absolute inset-0 bg-[#030304]/60 backdrop-blur-[2px] z-0" />

      <div className="w-full relative z-10">
        <AnimatePresence mode="wait">
          {step === 'VISION' && (
            <StepVision
              key="vision"
              data={data}
              updateData={updateData}
              onNext={() => setStep('DOMAIN')}
            />
          )}

          {step === 'DOMAIN' && (
            <StepDomain
              key="domain"
              data={data}
              updateData={updateData}
              onNext={() => setStep('INIT')}
              onBack={() => setStep('VISION')}
            />
          )}

          {step === 'INIT' && <AgentInitialization key="init" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
