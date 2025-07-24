"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import DemoPortfolio from "@/components/DemoPortfolio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    title: "Welcome to WorkPortfolio!",
    description: "Let's get you set up with your professional portfolio in just a few steps.",
    action: "Get Started"
  },
  {
    title: "Step 1: Edit Your Portfolio",
    description: "Click the edit button to customize your name, bio, and avatar.",
    action: "Next"
  },
  {
    title: "Step 2: Add Your Bio",
    description: "Write a compelling bio that introduces you and your expertise.",
    action: "Next"
  },
  {
    title: "Step 3: Upload Your First Project",
    description: "Add a link to your best work or upload a screenshot.",
    action: "Next"
  },
  {
    title: "Step 4: Preview & Publish",
    description: "Review your portfolio and publish it to make it live.",
    action: "Next"
  },
  {
    title: "You're All Set!",
    description: "Your portfolio is ready. Let's go see it in action!",
    action: "Go to Your Portfolio"
  }
];

export default function WelcomeDemo() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isProvisioning, setIsProvisioning] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
      return;
    }

    // Provision portfolio in background
    const provisionPortfolio = async () => {
      setIsProvisioning(true);
      try {
        await fetch("/api/provision-portfolio", { 
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } catch (error) {
        console.error('Error provisioning portfolio:', error);
      } finally {
        setIsProvisioning(false);
      }
    };

    provisionPortfolio();
  }, [isSignedIn, router]);

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      // Final step - redirect to their portfolio
      const username = user?.username || user?.id;
      router.push(`/${username}`);
    }
  };

  if (!isSignedIn) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/30">
      {/* Demo Portfolio */}
      <div className="pt-16">
        <DemoPortfolio />
      </div>

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full mx-auto">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                {step + 1}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {steps[step].title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {steps[step].description}
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex justify-center space-x-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= step ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextStep}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
              disabled={isProvisioning}
            >
              {isProvisioning ? "Setting up your portfolio..." : steps[step].action}
            </Button>

            {isProvisioning && (
              <p className="text-sm text-gray-500 mt-3">
                Creating your portfolio in the background...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 