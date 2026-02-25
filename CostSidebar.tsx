import { motion, AnimatePresence } from "framer-motion";
import { Check, TrendingUp, DollarSign, Zap } from "lucide-react";

export interface StepData {
  id: number;
  title: string;
  description: string;
  items: { name: string; cost: number }[];
}

export const STEPS: StepData[] = [
  {
    id: 1,
    title: "Posts & Frames",
    description: "Steel posts are driven into the ground and mounting frames are installed to support the panels at the optimal angle.",
    items: [
      { name: "Ground-mount posts & frames", cost: 500 },
      { name: "Installation labor", cost: 350 },
    ],
  },
  {
    id: 2,
    title: "Solar Panels",
    description: "Eight high-efficiency 560W monocrystalline panels are secured to the racking system for maximum energy production.",
    items: [
      { name: "560W panels × 8", cost: 1480 },
      { name: "Mounting hardware", cost: 250 },
      { name: "Installation labor", cost: 400 },
    ],
  },
  {
    id: 3,
    title: "Wiring & Conduit",
    description: "Electrical wiring connects the panels to the inverter and main panel. Conduit protects the cables underground.",
    items: [
      { name: "Complete wiring package", cost: 1800 },
    ],
  },
  {
    id: 4,
    title: "System Connection",
    description: "The inverter converts DC power to AC. The system is connected to your home's electrical panel and the utility grid.",
    items: [
      { name: "Hybrid inverter", cost: 1050 },
      { name: "Inspection & permits", cost: 750 },
    ],
  },
  {
    id: 5,
    title: "Battery Storage",
    description: "A battery backup stores excess energy for use at night or during outages, maximizing your energy independence.",
    items: [
      { name: "10kWh LiFePO4 battery system", cost: 7700 },
    ],
  },
];

const REVENUE = [
  { name: "REC Payment", amount: 6894.72, icon: Zap, color: "text-primary" },
  { name: "Smart Inverter Rebate", amount: 1344, icon: DollarSign, color: "text-secondary" },
  { name: "Battery Rebate", amount: 6000, icon: DollarSign, color: "text-secondary" },
];

interface CostSidebarProps {
  currentStep: number;
}

const CostSidebar = ({ currentStep }: CostSidebarProps) => {
  const completedSteps = STEPS.filter((s) => s.id <= currentStep);
  const totalCost = completedSteps.reduce(
    (sum, step) => sum + step.items.reduce((s, item) => s + item.cost, 0),
    0
  );
  const fullCost = STEPS.reduce(
    (sum, step) => sum + step.items.reduce((s, item) => s + item.cost, 0),
    0
  );

  const taxCredit = fullCost * 0.4;
  const totalRevenue = REVENUE.reduce((s, r) => s + r.amount, 0);
  const showEconomics = currentStep < 5;

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-widest mb-0.5">Investment</h2>
      <p className="text-xs text-muted-foreground mb-4">Click through each step to see costs</p>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isDone = step.id < currentStep;
          const isPending = step.id > currentStep;
          const stepTotal = step.items.reduce((s, item) => s + item.cost, 0);

          return (
            <motion.div
              key={step.id}
              layout
              className={`rounded-md border p-2.5 transition-all duration-300 ${
                isActive
                  ? "border-primary/40 bg-primary/5"
                  : isDone
                  ? "border-step-done/20 bg-step-done/5"
                  : "border-border bg-card opacity-40"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                    isDone
                      ? "bg-step-done text-primary-foreground"
                      : isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-step-pending text-muted-foreground"
                  }`}
                >
                  {isDone ? <Check size={11} /> : step.id}
                </div>
                <span className={`text-xs font-semibold ${isPending ? "text-muted-foreground" : "text-foreground"}`}>
                  {step.title}
                </span>
                <span className="ml-auto text-xs font-bold text-foreground tabular-nums">
                  {isPending ? "—" : `$${stepTotal.toLocaleString()}`}
                </span>
              </div>

              <AnimatePresence>
                {(isActive || isDone) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {isActive && (
                      <p className="text-[11px] text-muted-foreground mb-1.5 mt-1 leading-relaxed">{step.description}</p>
                    )}
                    <div className="space-y-0.5">
                      {step.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="text-foreground font-medium tabular-nums">${item.cost.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Explanatory text at step 5 */}
      {currentStep === 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 pt-4 border-t border-border"
        >
          <h3 className="text-xs font-bold text-primary uppercase mb-2 tracking-widest">About Your System</h3>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Your complete solar system installation is now ready. The financial summary below shows your total investment and the immediate returns from government incentives and tax credits. This investment generates ongoing savings year after year.
          </p>
        </motion.div>
      )}

      {/* Total */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Cost</span>
          <motion.span
            key={totalCost}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            className="text-xs font-bold text-red-500 tabular-nums"
          >
            ${totalCost.toLocaleString()}
          </motion.span>
        </div>
      </div>

      {/* Economics section — appears after all steps */}
      <AnimatePresence>
        {showEconomics && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp size={13} className="text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Revenue & Savings</span>
              </div>

              <div className="space-y-1.5">
                {REVENUE.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.15 }}
                    className="flex justify-between items-center text-[11px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <item.icon size={11} className={item.color} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-primary font-semibold tabular-nums">+${item.amount.toLocaleString()}</span>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85 }}
                  className="flex justify-between items-center text-[11px]"
                >
                  <div className="flex items-center gap-1.5">
                    <DollarSign size={11} className="text-accent" />
                    <span className="text-muted-foreground">Tax Credits (40%)</span>
                  </div>
                  <span className="text-accent font-semibold tabular-nums">+${taxCredit.toLocaleString()}</span>
                </motion.div>
              </div>

              {/* Net Profit */}
              <div className="mt-3 pt-2 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground">Total Incentives</span>
                  <span className="text-sm font-bold text-green-600 tabular-nums">
                    ${(totalRevenue + taxCredit).toLocaleString()}
                  </span>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex justify-between items-center rounded-md bg-green-600/10 px-3 py-3 border border-green-600/20"
                >
                  <span className="text-sm font-bold text-foreground">Net Profit</span>
                  <span className="text-xl font-bold text-green-600 tabular-nums">
                    +${(totalRevenue + taxCredit - fullCost).toLocaleString()}
                  </span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-[10px] text-muted-foreground mt-2 leading-relaxed"
                >
                  Your system generates {Math.round(((totalRevenue + taxCredit) / fullCost) * 100)}% profit through rebates and tax credits.
                  25+ year panel warranty included. You make money while saving the planet.
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CostSidebar;
