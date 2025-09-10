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
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card className="w-full shadow-lg rounded-2xl border-border/60">
        <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center text-foreground">
                <Wand2 className="w-5 h-5 mr-3 text-primary" />
                Votre Texte
            </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid gap-4">
            <Textarea
              placeholder="Collez votre texte IA ici..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[300px] text-base rounded-xl bg-muted/50 border-border/80 focus-visible:ring-primary focus-visible:ring-2"
              disabled={isPending}
            />
            {error && <p className="text-sm text-destructive font-medium px-1">{error}</p>}
            <Button 
              onClick={handleHumanize} 
              disabled={isPending || !inputText.trim()} 
              size="lg" 
              className="w-full font-bold text-base py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95"
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

      <Card className="w-full shadow-lg rounded-2xl border-border/60 min-h-[504px]">
        <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-xl font-semibold flex items-center text-foreground">
              <PenLine className="w-5 h-5 mr-3 text-primary" />
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
        <CardContent className="p-6 pt-0">
          <motion.div 
            key={humanizedText ? 'text' : 'placeholder'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="prose prose-base max-w-none text-foreground/90 min-h-[350px] p-4 bg-muted/50 rounded-xl border border-border/80"
          >
            {isPending ? (
               <div className="flex items-center justify-center h-full min-h-[280px]">
                <LoaderCircle className="w-8 h-8 text-primary animate-spin" />
               </div>
            ) : humanizedText ? (
                <p>{humanizedText}</p>
            ) : (
              <div className="text-muted-foreground flex items-center justify-center h-full min-h-[280px]">
                <p>Le résultat humanisé apparaîtra ici...</p>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
