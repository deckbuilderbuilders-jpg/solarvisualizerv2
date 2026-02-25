import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

interface TutorialOverlayProps {
  onStart: () => void;
}

const TutorialOverlay = ({ onStart }: TutorialOverlayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 180 }}
        className="bg-card rounded-lg p-8 max-w-md mx-4 border border-border text-center"
      >
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight">
          Your Solar Investment
        </h2>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          See exactly how a ground-mount solar system is built — step by step — and understand the economics of going solar.
        </p>
        <div className="space-y-2.5 text-left mb-6">
          {[
            "Navigate through 5 installation phases",
            "See real costs for each component",
            "Discover rebates, credits & your net investment",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                {i + 1}
              </span>
              {tip}
            </div>
          ))}
        </div>
        <button
          onClick={onStart}
          className="w-full bg-primary text-primary-foreground rounded-md py-3 px-6 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-sm tracking-wide"
        >
          Explore the System
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default TutorialOverlay;
