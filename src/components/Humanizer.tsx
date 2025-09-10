'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Copy, Wand2, LoaderCircle, PenLine } from 'lucide-react';
import { humanizeText } from '@/ai/flows/humanize-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { HumanizeTextInput } from '@/ai/flows/schemas';

export function Humanizer() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [inputText, setInputText] = useState("In today's digital world, making sure websites are easy to use is super important for them to do well. We need to look at how people use them to find out what we can make better. By using data, we can create simpler navigation and improve how users sign up or buy things. This helps keep them coming back.");
  const [humanizedText, setHumanizedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleHumanize = () => {
    if (!inputText.trim()) {
      setError('Veuillez entrer du texte à humaniser.');
      return;
    }
    setError(null);
    setHumanizedText('');

    startTransition(async () => {
      try {
        const result = await humanizeText({ text: inputText } as HumanizeTextInput);
        setHumanizedText(result);
      } catch (e) {
        setError("Une erreur est survenue lors de l'humanisation. Veuillez réessayer.");
        console.error(e);
      }
    });
  };

  const handleCopy = () => {
    if (humanizedText) {
      navigator.clipboard.writeText(humanizedText);
      toast({
        title: 'Copié dans le presse-papiers !',
        description: 'Le texte humanisé est prêt à être utilisé.',
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
        <Card className="w-full shadow-2xl rounded-2xl bg-card/50 backdrop-blur-xl border-white/10">
          <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center text-foreground">
                  <Wand2 className="w-5 h-5 mr-3 text-primary" />
                  Votre Texte
              </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Textarea
                placeholder="Collez votre texte IA ici..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[300px] text-base rounded-xl bg-black/20 border-white/10 focus-visible:ring-primary/80 focus-visible:ring-2 text-white placeholder:text-white/70"
                disabled={isPending}
              />
              {error && <p className="text-sm text-destructive font-medium px-1">{error}</p>}
              <Button 
                onClick={handleHumanize} 
                disabled={isPending || !inputText.trim()} 
                size="lg" 
                className="w-full font-bold text-base py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 active:scale-95"
              >
                {isPending ? (
                  <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-5 w-5" />
                )}
                Humaniser le Texte
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
        <Card className="w-full shadow-2xl rounded-2xl bg-card/50 backdrop-blur-xl border-white/10 min-h-[520px]">
          <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-xl font-semibold flex items-center text-foreground">
                <span className="w-5 h-5 mr-3 text-primary flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                </span>
                Texte Humanisé
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                disabled={!humanizedText || isPending}
                className="text-muted-foreground hover:text-primary rounded-full"
              >
                <Copy className="h-5 w-5" />
                <span className="sr-only">Copier</span>
              </Button>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-base dark:prose-invert max-w-none text-white/90 min-h-[350px] p-4 bg-black/20 rounded-xl border border-white/10"
            >
              {isPending ? (
                 <div className="flex flex-col items-center justify-center h-full min-h-[280px]">
                  <LoaderCircle className="w-8 h-8 text-primary animate-spin" />
                  <p className="mt-4 text-sm text-muted-foreground animate-pulse">Humanisation en cours...</p>
                 </div>
              ) : humanizedText ? (
                  <p>{humanizedText}</p>
              ) : (
                <div className="text-white flex flex-col gap-2 items-center justify-center h-full min-h-[280px]">
                  <PenLine className="w-10 h-10 text-white/50" />
                  <p className="font-medium">Le résultat humanisé apparaîtra ici...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
