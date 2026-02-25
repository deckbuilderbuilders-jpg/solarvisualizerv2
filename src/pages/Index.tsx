import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import SolarScene from "@/components/SolarScene";
import CostSidebar from "@/components/CostSidebar";
import { STEPS } from "@/components/CostSidebar";
import TutorialOverlay from "@/components/TutorialOverlay";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const handleStart = () => {
    setShowTutorial(false);
    setCurrentStep(1);
  };

  const next = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 1));
  const reset = () => {
    setCurrentStep(0);
    setShowTutorial(true);
  };

  const activeStep = STEPS.find((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between bg-card/50 backdrop-blur-sm">
        <div>
          <h1 className="text-sm font-bold text-foreground tracking-tight">Solar Installation Guide</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Ground-Mount System</p>
        </div>
        {currentStep > 0 && (
          <div className="flex items-center gap-1.5">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`h-1 rounded-full transition-all duration-500 ${
                  step.id <= currentStep ? "bg-primary w-6" : "bg-step-pending w-2"
                }`}
              />
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Scene area */}
        <div className="flex-1 relative flex flex-col">
          <AnimatePresence>
            {showTutorial && <TutorialOverlay onStart={handleStart} />}
          </AnimatePresence>

          <div className="flex-1 flex items-center justify-center p-4">
            <SolarScene currentStep={currentStep} />
          </div>

          {/* Step title + navigation */}
          {currentStep > 0 && (
            <div className="px-6 pb-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4"
                >
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                    Step {currentStep} of 5
                  </span>
                  <h2 className="text-lg font-bold text-foreground tracking-tight">{activeStep?.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">{activeStep?.description}</p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  disabled={currentStep <= 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-md border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                {currentStep < 5 ? (
                  <button
                    onClick={next}
                    className="flex items-center gap-1 px-5 py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    Next <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={reset}
                    className="flex items-center gap-1 px-5 py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    <RotateCcw size={14} /> Start Over
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cost sidebar */}
        <aside className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-border bg-card/50 backdrop-blur-sm p-5">
          <CostSidebar currentStep={currentStep} />
        </aside>
      </div>
    </div>
  );
};

export default Index;
