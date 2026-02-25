import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import SolarScene from "@/components/SolarScene";
import CostSidebar from "@/components/CostSidebar";
import { STEPS } from "@/components/CostSidebar";
import TutorialOverlay from "@/components/TutorialOverlay";
import EconomicsBox from "@/components/EconomicsBox";

const REVENUE = [
  { name: "REC Payment", amount: 6894.72, icon: "Zap", color: "text-primary" },
  { name: "Smart Inverter Rebate", amount: 1344, icon: "DollarSign", color: "text-secondary" },
  { name: "Battery Rebate", amount: 6000, icon: "DollarSign", color: "text-secondary" },
];

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

  // Calculate economics values for EconomicsBox
  const fullCost = STEPS.reduce(
    (sum, step) => sum + step.items.reduce((s, item) => s + item.cost, 0),
    0
  );
  const taxCredit = fullCost * 0.4;
  const totalRevenue = REVENUE.reduce((s, r) => s + r.amount, 0);

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

          {/* Scene */}
          <div className="flex-1 flex items-center justify-center p-4">
            <SolarScene currentStep={currentStep} />
          </div>

          {/* Economics box - centered below scene only at step 5 */}
          {currentStep === 5 && (
            <div className="w-full flex justify-center px-4 pb-6">
              <div className="w-full max-w-2xl">
                <EconomicsBox
                  totalRevenue={totalRevenue}
                  taxCredit={taxCredit}
                  fullCost={fullCost}
                />
              </div>
            </div>
          )}

          {/* Step title + navigation - only shown for steps 1-4 */}
          {currentStep > 0 && currentStep < 5 && (
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

        {/* Sidebar - changes content based on step */}
        <aside className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-border bg-card/50 backdrop-blur-sm p-5">
          {currentStep === 5 ? (
            // Step 5: Show step title, description, and navigation in sidebar
            <div>
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
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{activeStep?.description}</p>
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
                <button
                  onClick={reset}
                  className="flex items-center gap-1 px-5 py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <RotateCcw size={14} /> Start Over
                </button>
              </div>
            </div>
          ) : (
            // Steps 1-4: Show CostSidebar
            <CostSidebar currentStep={currentStep} />
          )}
        </aside>
      </div>
    </div>
  );
};

export default Index;
