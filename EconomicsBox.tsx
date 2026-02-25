import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, DollarSign, Zap } from "lucide-react";

const REVENUE = [
  { name: "REC Payment", amount: 6894.72, icon: Zap, color: "text-primary" },
  { name: "Smart Inverter Rebate", amount: 1344, icon: DollarSign, color: "text-secondary" },
  { name: "Battery Rebate", amount: 6000, icon: DollarSign, color: "text-secondary" },
];

interface EconomicsBoxProps {
  totalRevenue: number;
  taxCredit: number;
  fullCost: number;
}

const EconomicsBox = ({ totalRevenue, taxCredit, fullCost }: EconomicsBoxProps) => {
  return (
    <AnimatePresence>
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
    </AnimatePresence>
  );
};

export default EconomicsBox;
