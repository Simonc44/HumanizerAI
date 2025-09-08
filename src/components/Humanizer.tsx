'use client';

import { useState, useTransition, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Wand2, LoaderCircle, PenLine } from 'lucide-react';
import { humanizeTextFlow } from '@/ai/flows/humanize-text';
import { analyzeTextHumanity } from '@/ai/flows/analyze-text-humanity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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
        await humanizeTextFlow({ text: inputText }, (chunk) => {
          setHumanizedText((prev) => prev + chunk);
        });
      } catch (e) {
        setError('Une erreur est survenue. Veuillez réessayer.');
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
    <div className="grid md:grid-cols-2 gap-6 items-start">
      <Card className="w-full shadow-sm border rounded-xl">
        <CardContent className="p-6">
          <div className="grid gap-4">
            <Textarea
              placeholder="Collez votre texte ici..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[300px] text-base rounded-lg bg-secondary/50 focus-visible:ring-blue-500"
              disabled={isPending}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button 
              onClick={handleHumanize} 
              disabled={isPending || !inputText.trim()} 
              size="lg" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-all duration-300 hover:shadow-md active:scale-95 rounded-lg"
            >
              {isPending ? (
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-5 w-5" />
              )}
              Humaniser
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full shadow-sm border rounded-xl min-h-[462px]">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <PenLine className="w-5 h-5 mr-2 text-blue-600" />
              Texte Humanisé
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              disabled={!humanizedText || isPending}
              className="text-muted-foreground hover:text-foreground"
            >
              <Copy className="h-5 w-5" />
              <span className="sr-only">Copier</span>
            </Button>
          </div>
          <div className="prose prose-sm max-w-none text-base text-foreground min-h-[300px] p-4 bg-secondary/50 rounded-lg">
            {humanizedText}
            {isPending && (
              <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1 rounded-sm" />
            )}
            {!humanizedText && !isPending && (
              <div className="text-muted-foreground flex items-center justify-center h-full min-h-[200px]">
                <p>Le texte humanisé apparaîtra ici.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
