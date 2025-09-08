'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BotMessageSquare, PenLine } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Humanizer } from '@/components/Humanizer';
import { AiDetector } from '@/components/AiDetector';

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold font-headline tracking-tight bg-gradient-to-r from-blue-500 to-blue-300 text-transparent bg-clip-text">
              Humanizer AI
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20, transition: { delay: 0.1 } }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Transformez votre texte IA en contenu humain et authentique.
            </motion.p>
          </header>

          <Tabs defaultValue="humanizer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-900/20 rounded-lg">
              <TabsTrigger value="humanizer" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md">
                <PenLine className="w-4 h-4 mr-2" />
                Humanizer
              </TabsTrigger>
              <TabsTrigger value="detector" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md">
                <BotMessageSquare className="w-4 h-4 mr-2" />
                AI Detector
              </TabsTrigger>
            </TabsList>
            <TabsContent value="humanizer">
              <Humanizer />
            </TabsContent>
            <TabsContent value="detector">
              <AiDetector />
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  );
}
