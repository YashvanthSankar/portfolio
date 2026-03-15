"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: ReactNode;
  description?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeader({ label, title, description, center = false, className }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("mb-12", center && "text-center", className)}
    >
      <p className="text-xs text-zinc-400 dark:text-zinc-500 tracking-widest uppercase mb-3">
        {`// ${label}`}
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 max-w-xl">
          {description}
        </p>
      )}
    </motion.div>
  );
}
