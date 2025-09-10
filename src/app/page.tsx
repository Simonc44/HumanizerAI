'use client';

import { BotMessageSquare, PenLine } from 'lucide-react';
import { motion } from 'framer-motion';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Humanizer } from '@/components/Humanizer';
import { AiDetector } from '@/components/AiDetector';

export default function Home() {
  return (
    <div className="bg-background min-h-screen font-body">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="text-center mb-12">
            <h1 className="text-6xl md:text-8xl font-balloon tracking-wide text-foreground" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
              <span className="text-blue-500">H</span>
              <span className="text-red-500">u</span>
              <span className="text-yellow-500">m</span>
              <span className="text-green-500">a</span>
              <span className="text-purple-500">n</span>
              <span className="text-pink-500">i</span>
              <span className="text-orange-500">z</span>
              <span className="text-teal-500">e</span>
              <span className="text-primary">r</span>
              <span className="text-primary text-5xl md:text-7xl">AI</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Transformez votre texte IA en contenu humain, authentique et indétectable.
            </p>
          </header>

          <Tabs defaultValue="humanizer" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 bg-muted p-1 h-12 rounded-xl">
              <TabsTrigger value="humanizer" className="text-base font-medium rounded-lg h-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                <PenLine className="w-5 h-5 mr-2" />
                Humanizer
              </TabsTrigger>
              <TabsTrigger value="detector" className="text-base font-medium rounded-lg h-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                <BotMessageSquare className="w-5 h-5 mr-2" />
                AI Detector
              </TabsTrigger>
            </TabsList>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
      </main>
    </div>
  );
}
