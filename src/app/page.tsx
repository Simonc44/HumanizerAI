'use client';

import { BotMessageSquare, PenLine } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Humanizer } from '@/components/Humanizer';
import { AiDetector } from '@/components/AiDetector';

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
              Humanizer <span className="text-blue-600">AI</span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Transformez votre texte IA en contenu humain, authentique et indétectable.
            </p>
          </header>

          <Tabs defaultValue="humanizer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted p-1 h-12 rounded-xl">
              <TabsTrigger value="humanizer" className="text-base font-medium rounded-lg h-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                <PenLine className="w-5 h-5 mr-2" />
                Humanizer
              </TabsTrigger>
              <TabsTrigger value="detector" className="text-base font-medium rounded-lg h-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                <BotMessageSquare className="w-5 h-5 mr-2" />
                AI Detector
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="humanizer">
                <Humanizer />
              </TabsContent>
              <TabsContent value="detector">
                <AiDetector />
              </TabsContent>
            </div>
          </Tabs>

        </div>
      </main>
    </div>
  );
}
