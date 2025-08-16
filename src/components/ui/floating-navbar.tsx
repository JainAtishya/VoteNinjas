"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "../../lib/utils";
import Link from "next/link";
import { Menu, X } from "lucide-react";


export const FloatingNav = ({
  navItems,
    rightContent,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  rightContent?: React.ReactNode; 
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          if (direction > 0.02) { // Only hide after significant scroll down
            setVisible(false);
          }
        }
      }
    }
  });

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{
            opacity: 1,
            y: -100,
          }}
          animate={{
            y: visible ? 0 : -100,
            opacity: visible ? 1 : 0,
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
          className={cn(
            "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-8 py-2 items-center justify-center space-x-4",
            className
          )}
        >
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((navItem: any, idx: number) => (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className={cn(
                  "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
                )}
              >
                <span className="text-sm">{navItem.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-neutral-600 dark:text-neutral-50" />
              ) : (
                <Menu className="w-5 h-5 text-neutral-600 dark:text-neutral-50" />
              )}
            </motion.button>
          </div>

          {/* Right Content (Always visible) */}
          <div className="flex items-center gap-4">{rightContent}</div>
        </motion.div>
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-[4999] bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-20 left-4 right-4 z-[5001] bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-4"
          >
            {navItems.map((navItem: any, idx: number) => (
              <Link
                key={`mobile-link=${idx}`}
                href={navItem.link}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-6 py-4 text-neutral-600 dark:text-neutral-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {navItem.icon && <span className="text-neutral-500">{navItem.icon}</span>}
                <span className="font-medium">{navItem.name}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};