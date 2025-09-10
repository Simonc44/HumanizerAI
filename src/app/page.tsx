'use client';

import { BotMessageSquare, PenLine } from 'lucide-react';
import { motion } from 'framer-motion';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Humanizer } from '@/components/Humanizer';
import { AiDetector } from '@/components/AiDetector';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="bg-background min-h-screen font-body text-foreground aurora-bg">
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.header variants={itemVariants} className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight pb-2 group">
                <span className="text-shine bg-gradient-to-br from-white via-neutral-300 to-neutral-500">
                    Humanizer<span className="text-primary">AI</span>
                </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Transformez votre texte IA en contenu humain, authentique et indétectable.
            </p>
          </motion.header>

          <motion.div variants={itemVariants}>
            <Tabs defaultValue="humanizer" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-transparent border border-border/50 p-1 h-12 rounded-xl backdrop-blur-sm">
                <TabsTrigger value="humanizer" className="text-base font-medium rounded-lg h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-inner data-[state=active]:shadow-primary/10">
                  <PenLine className="w-5 h-5 mr-2" />
                  Humanizer
                </TabsTrigger>
                <TabsTrigger value="detector" className="text-base font-medium rounded-lg h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-inner data-[state=active]:shadow-primary/10">
                  <BotMessageSquare className="w-5 h-5 mr-2" />
                  AI Detector
                </TabsTrigger>
              </TabsList>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8"
              >
                <TabsContent value="humanizer">
                  <Humanizer />
                </TabsContent>
                <TabsContent value="detector">
                  <AiDetector />
                </TabsContent>
              </motion.div>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
