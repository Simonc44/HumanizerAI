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
    <div className="bg-background min-h-screen font-body text-foreground">
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.header variants={itemVariants} className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground pb-2">
              Humanizer<span className="text-primary">AI</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Transformez votre texte IA en contenu humain, authentique et indétectable.
            </p>
          </motion.header>

          <motion.div variants={itemVariants}>
            <Tabs defaultValue="humanizer" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted p-1 h-12 rounded-xl">
                <TabsTrigger value="humanizer" className="text-base font-medium rounded-lg h-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <PenLine className="w-5 h-5 mr-2 text-primary" />
                  Humanizer
                </TabsTrigger>
                <TabsTrigger value="detector" className="text-base font-medium rounded-lg h-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <BotMessageSquare className="w-5 h-5 mr-2 text-primary" />
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
