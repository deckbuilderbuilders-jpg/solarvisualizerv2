import { motion } from "framer-motion";

interface SolarSceneProps {
  currentStep: number;
}

const SolarScene = ({ currentStep }: SolarSceneProps) => {
  // Calculate theme progress (0 = night, 1 = day)
  // Step 0: 0, Step 1: 0.2, Step 2: 0.5, Step 3: 0.75, Step 4: 0.9, Step 5: 1
  const themeProgress = Math.min(currentStep / 5, 1) * 0.2 + (Math.max(currentStep - 1, 0) / 4) * 0.8;

  // Interpolate between two HSL colors
  const interpolateColor = (
    nightH: number, nightS: number, nightL: number,
    dayH: number, dayS: number, dayL: number,
    progress: number
  ) => {
    const h = Math.round(nightH + (dayH - nightH) * progress);
    const s = Math.round(nightS + (dayS - nightS) * progress);
    const l = Math.round(nightL + (dayL - nightL) * progress);
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  // Sky gradient colors
  const skyTopColor = interpolateColor(220, 35, 10, 200, 75, 80, themeProgress);
  const skyMidColor = interpolateColor(215, 30, 18, 200, 70, 85, themeProgress);
  const skyBotColor = interpolateColor(210, 25, 28, 195, 65, 88, themeProgress);

  // Ground colors
  const groundTopColor = interpolateColor(150, 20, 20, 110, 40, 45, themeProgress);
  const groundBotColor = interpolateColor(150, 25, 12, 110, 35, 35, themeProgress);

  // Panel colors
  const panelTopColor = interpolateColor(215, 45, 38, 210, 50, 45, themeProgress);
  const panelMidColor = interpolateColor(215, 50, 28, 210, 50, 35, themeProgress);
  const panelBotColor = interpolateColor(215, 55, 22, 210, 50, 28, themeProgress);

  // Sun/Moon position and opacity
  const sunOpacity = Math.min(themeProgress, 0.7);
  const starsOpacity = Math.max(0.4 - themeProgress * 0.5, 0);

  // Ground texture color
  const groundTextureColor = interpolateColor(150, 30, 25, 110, 40, 50, themeProgress);

  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" style={{ maxHeight: "70vh" }}>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyTopColor} />
          <stop offset="60%" stopColor={skyMidColor} />
          <stop offset="100%" stopColor={skyBotColor} />
        </linearGradient>
        <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={groundTopColor} />
          <stop offset="100%" stopColor={groundBotColor} />
        </linearGradient>
        <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={panelTopColor} />
          <stop offset="50%" stopColor={panelMidColor} />
          <stop offset="100%" stopColor={panelBotColor} />
        </linearGradient>
        <linearGradient id="panelShine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(215, 60%, 55%)" stopOpacity={String(0.4 * (1 - themeProgress * 0.5))} />
          <stop offset="50%" stopColor="hsl(215, 60%, 55%)" stopOpacity="0" />
          <stop offset="100%" stopColor="hsl(215, 60%, 55%)" stopOpacity={String(0.1 * (1 - themeProgress * 0.5))} />
        </linearGradient>
        <linearGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
          <stop offset="0%" stopColor="hsl(45, 95%, 70%)" stopOpacity={String(Math.max(0.3 * themeProgress, 0))} />
          <stop offset="100%" stopColor="hsl(45, 95%, 70%)" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="800" height="360" fill="url(#skyGrad)" />

      {/* Stars */}
      {[
        [80, 40], [200, 25], [350, 55], [480, 30], [600, 50], [720, 35],
        [150, 80], [400, 20], [550, 70], [680, 15], [260, 45], [520, 85],
      ].map(([cx, cy], i) => (
        <circle key={`star-${i}`} cx={cx} cy={cy} r={0.8} fill="hsl(0, 0%, 85%)" opacity={(0.4 + (i % 3) * 0.2) * starsOpacity} />
      ))}

      {/* Moon/Sun glow - transitions from subtle to bright */}
      <circle cx="680" cy="80" r="80" fill="hsl(45, 90%, 70%)" opacity={String(0.04 + sunOpacity * 0.3)} filter="url(#softGlow)" />
      <circle cx="680" cy="80" r="30" fill="hsl(45, 90%, 75%)" opacity={String(0.15 + sunOpacity * 0.35)} />
      <circle cx="680" cy="80" r="18" fill="hsl(45, 95%, 80%)" opacity={String(0.3 + sunOpacity * 0.4)} />

      {/* Horizon glow */}
      <rect x="0" y="320" width="800" height="40" fill={interpolateColor(210, 25, 28, 180, 60, 70, themeProgress)} opacity={String(0.5 * (1 - themeProgress * 0.3))} />

      {/* Ground */}
      <rect x="0" y="350" width="800" height="150" fill="url(#groundGrad)" />

      {/* Subtle ground texture */}
      {Array.from({ length: 20 }).map((_, i) => (
        <line
          key={`tex-${i}`}
          x1={i * 42}
          y1={385 + Math.sin(i * 1.5) * 8}
          x2={i * 42 + 15}
          y2={380 + Math.sin(i * 1.5) * 8}
          stroke={groundTextureColor}
          strokeWidth="1"
          opacity={String(0.3 * (1 - themeProgress * 0.2))}
        />
      ))}

      {/* House — clean modern style */}
      <g>
        {/* Shadow */}
        <ellipse cx="670" cy="360" rx="120" ry="8" fill="hsl(220, 20%, 5%)" opacity={String(0.4 * (1 - themeProgress * 0.5))} />
        {/* Wall */}
        <rect x="580" y="240" width="180" height="115" fill={interpolateColor(220, 12, 55, 200, 15, 75, themeProgress)} rx="2" />
        <rect x="582" y="242" width="176" height="111" fill={interpolateColor(220, 10, 62, 200, 12, 82, themeProgress)} rx="1" />
        {/* Roof */}
        <polygon points="570,240 670,180 770,240" fill={interpolateColor(220, 15, 30, 210, 25, 45, themeProgress)} />
        <polygon points="575,240 670,184 765,240" fill={interpolateColor(220, 12, 35, 210, 20, 50, themeProgress)} />
        {/* Door */}
        <rect x="648" y="295" width="32" height="60" fill={interpolateColor(220, 15, 35, 210, 20, 40, themeProgress)} rx="2" />
        <rect x="650" y="297" width="28" height="56" fill={interpolateColor(220, 12, 40, 210, 18, 45, themeProgress)} rx="1" />
        <circle cx="671" cy="327" r="2" fill="hsl(45, 50%, 60%)" />
        {/* Windows — lit up warm, fade glow in daylight */}
        <rect x="598" y="265" width="34" height="28" fill="hsl(45, 50%, 55%)" rx="1" opacity={String(0.7 - themeProgress * 0.4)} />
        <rect x="600" y="267" width="30" height="24" fill="hsl(45, 60%, 65%)" rx="1" opacity={String(0.5 - themeProgress * 0.3)} />
        <line x1="615" y1="265" x2="615" y2="293" stroke={interpolateColor(220, 10, 55, 210, 15, 50, themeProgress)} strokeWidth="1.5" />
        <line x1="598" y1="279" x2="632" y2="279" stroke={interpolateColor(220, 10, 55, 210, 15, 50, themeProgress)} strokeWidth="1.5" />
        <rect x="698" y="265" width="34" height="28" fill="hsl(45, 50%, 55%)" rx="1" opacity={String(0.7 - themeProgress * 0.4)} />
        <rect x="700" y="267" width="30" height="24" fill="hsl(45, 60%, 65%)" rx="1" opacity={String(0.5 - themeProgress * 0.3)} />
        <line x1="715" y1="265" x2="715" y2="293" stroke={interpolateColor(220, 10, 55, 210, 15, 50, themeProgress)} strokeWidth="1.5" />
        <line x1="698" y1="279" x2="732" y2="279" stroke={interpolateColor(220, 10, 55, 210, 15, 50, themeProgress)} strokeWidth="1.5" />
      </g>

      {/* Electrical panel on house */}
      {currentStep >= 4 && (
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <rect x="572" y="285" width="16" height="22" fill="hsl(220, 10%, 40%)" stroke="hsl(220, 10%, 30%)" strokeWidth="1" rx="2" />
          <line x1="576" y1="292" x2="584" y2="292" stroke="hsl(152, 60%, 50%)" strokeWidth="1.5" />
          <line x1="576" y1="296" x2="584" y2="296" stroke="hsl(0, 60%, 50%)" strokeWidth="1.5" />
          <line x1="576" y1="300" x2="584" y2="300" stroke="hsl(45, 70%, 55%)" strokeWidth="1.5" />
        </motion.g>
      )}

      {/* Step 1: Posts and Frames */}
      {currentStep >= 1 && (
        <motion.g
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {[100, 180, 260, 340, 420].map((x, i) => (
            <motion.g
              key={`post-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <rect x={x - 3} y="340" width="6" height="20" fill="hsl(220, 8%, 45%)" />
              <rect x={x - 2.5} y="300" width="5" height="45" fill="hsl(220, 8%, 50%)" />
            </motion.g>
          ))}
          <motion.rect
            x="95" y="300" width="330" height="3"
            fill="hsl(220, 8%, 50%)"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ transformOrigin: "95px 301px" }}
          />
          <motion.rect
            x="95" y="325" width="330" height="3"
            fill="hsl(220, 8%, 50%)"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{ transformOrigin: "95px 326px" }}
          />
        </motion.g>
      )}

      {/* Step 2: Solar Panels */}
      {currentStep >= 2 && (
        <motion.g>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const x = 100 + col * 82;
            const y = 293 + row * 19;
            return (
              <motion.g
                key={`panel-${i}`}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <rect x={x} y={y} width="78" height="16" fill="url(#panelGrad)" stroke="hsl(220, 8%, 45%)" strokeWidth="0.8" rx="1" />
                <rect x={x} y={y} width="78" height="16" fill="url(#panelShine)" rx="1" />
                {/* Grid lines */}
                <line x1={x + 19.5} y1={y} x2={x + 19.5} y2={y + 16} stroke="hsl(215, 35%, 35%)" strokeWidth="0.3" />
                <line x1={x + 39} y1={y} x2={x + 39} y2={y + 16} stroke="hsl(215, 35%, 35%)" strokeWidth="0.3" />
                <line x1={x + 58.5} y1={y} x2={x + 58.5} y2={y + 16} stroke="hsl(215, 35%, 35%)" strokeWidth="0.3" />
                <line x1={x} y1={y + 8} x2={x + 78} y2={y + 8} stroke="hsl(215, 35%, 35%)" strokeWidth="0.3" />
              </motion.g>
            );
          })}
        </motion.g>
      )}

      {/* Step 3: Wiring */}
      {currentStep >= 3 && (
        <motion.g>
          <motion.path
            d="M 428 310 C 450 310, 465 355, 480 362 C 495 370, 530 360, 550 340 C 560 330, 568 310, 572 296"
            fill="none"
            stroke="hsl(35, 80%, 55%)"
            strokeWidth="2.5"
            strokeDasharray="5 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          <motion.rect
            x="460" y="360" width="90" height="5" rx="2.5"
            fill="hsl(220, 8%, 40%)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          />
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <rect x="470" y="378" width="45" height="14" rx="7" fill="hsl(35, 80%, 55%)" opacity="0.15" />
            <text x="492" y="388" textAnchor="middle" fontSize="7" fill="hsl(35, 70%, 55%)" fontWeight="600" fontFamily="Inter, sans-serif">AC/DC</text>
          </motion.g>
        </motion.g>
      )}

      {/* Step 4: Inverter */}
      {currentStep >= 4 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <rect x="505" y="305" width="26" height="30" fill="hsl(220, 10%, 70%)" stroke="hsl(220, 10%, 45%)" strokeWidth="1" rx="3" />
            <rect x="507" y="307" width="22" height="26" fill="hsl(220, 8%, 75%)" rx="2" />
            <text x="518" y="318" textAnchor="middle" fontSize="5.5" fill="hsl(220, 10%, 30%)" fontWeight="700" fontFamily="Inter, sans-serif">INV</text>
            <motion.circle
              cx="518" cy="327" r="2.5"
              fill="hsl(152, 70%, 50%)"
              filter="url(#glow)"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </motion.g>
          <line x1="531" y1="320" x2="572" y2="296" stroke="hsl(220, 10%, 45%)" strokeWidth="1.5" />
        </motion.g>
      )}

      {/* Step 5: Battery */}
      {currentStep >= 5 && (
        <motion.g
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <rect x="538" y="340" width="30" height="18" rx="3" fill="hsl(152, 50%, 30%)" stroke="hsl(152, 45%, 22%)" strokeWidth="1.5" />
          <rect x="547" y="336" width="12" height="5" rx="1.5" fill="hsl(152, 45%, 22%)" />
          {[0, 1, 2].map((i) => (
            <motion.rect
              key={`batt-${i}`}
              x={543 + i * 8} y="344" width="6" height="9" rx="1"
              fill="hsl(152, 60%, 45%)"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3 + i * 0.2 }}
              style={{ transformOrigin: "bottom" }}
            />
          ))}
          <line x1="538" y1="347" x2="531" y2="333" stroke="hsl(152, 40%, 30%)" strokeWidth="1.5" />
          <text x="553" y="370" textAnchor="middle" fontSize="6.5" fill="hsl(152, 40%, 40%)" fontWeight="600" fontFamily="Inter, sans-serif">10kWh</text>
        </motion.g>
      )}

      {/* Energy flow particles */}
      {currentStep >= 4 && (
        <motion.g>
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={`energy-${i}`}
              r="2.5"
              fill="hsl(45, 95%, 65%)"
              filter="url(#glow)"
              opacity="0.9"
              animate={{
                cx: [200, 428, 518, 572],
                cy: [305, 310, 320, 296],
              }}
              transition={{
                duration: 3,
                delay: i * 1,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </motion.g>
      )}
    </svg>
  );
};

export default SolarScene;
