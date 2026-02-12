import { motion } from 'motion/react';

export function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
      <div className="text-center">
        <motion.div
          className="inline-block"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="rounded-full h-16 w-16 border-4 border-[#e8e5df] border-t-[#4a7c65]"></div>
        </motion.div>
        <p className="text-[#7a7369] mt-4 font-medium">Carregando sistema clínico...</p>
        <p className="text-[#a39d93] text-sm mt-2">Aguarde um momento</p>
      </div>
    </div>
  );
}
