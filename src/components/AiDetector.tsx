'use client';

import { useState, useTransition, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoaderCircle, BotMessageSquare } from 'lucide-react';
import { analyzeTextHumanity, type AnalyzeTextHumanityOutput } from '@/ai/flows/analyze-text-humanity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

export function AiDetector() {
  const [isPending, startTransition] = useTransition();
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<AnalyzeTextHumanityOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPending) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPending]);

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      setError('Veuillez entrer du texte à analyser.');
      return;
    }
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const res = await analyzeTextHumanity({ text: inputText });
        setProgress(100);
        setTimeout(() => setResult(res), 300); // Small delay for progress bar to finish
      } catch (e) {
        setError("Une erreur s'est produite lors de l'analyse. Veuillez réessayer.");
        console.error(e);
        setProgress(0);
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score > 0.6) return 'text-red-500'; // AI
    if (score > 0.3) return 'text-yellow-500'; // Mix
    return 'text-green-500'; // Human
  };
  
  const getScoreText = (score: number) => {
    if (score > 0.6) return "Probablement généré par une IA";
    if (score > 0.3) return "Sûrement un mix IA/Humain";
    return "Probablement écrit par un humain";
  }

  return (
    <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
    <Card className="w-full shadow-2xl rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
      <CardContent className="p-6">
        <div className="grid gap-4">
          <Textarea
            placeholder="Collez le texte à analyser..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[250px] text-base rounded-lg bg-black/20 focus-visible:ring-primary border-white/10"
            disabled={isPending}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button 
            onClick={handleAnalyze} 
            disabled={isPending || !inputText.trim()} 
            size="lg" 
            className="w-full md:w-auto justify-self-end bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 rounded-lg"
          >
            {isPending ? (
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <BotMessageSquare className="mr-2 h-5 w-5" />
            )}
            Analyser le Texte
          </Button>
        </div>

        <AnimatePresence>
          {(isPending || result) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-white/10"
            >
              <div className="space-y-4">
                <AnimatePresence>
                {isPending && (
                  <motion.div 
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-sm text-muted-foreground font-medium">Analyse en cours...</p>
                    <Progress value={progress} className="w-full h-2 bg-white/10" />
                  </motion.div>
                )}
                </AnimatePresence>

                <AnimatePresence>
                  {result && !isPending && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="text-center"
                    >
                      <p className="text-lg font-medium mb-2">{getScoreText(result.humanityScore)}</p>
                      <h3 className={`text-6xl font-bold ${getScoreColor(result.humanityScore)}`}>
                        {Math.round((1 - result.humanityScore) * 100)}%
                        <span className="text-2xl text-muted-foreground font-normal ml-2">Humain</span>
                      </h3>
                      <div className="flex items-center gap-4 mt-4 max-w-sm mx-auto">
                        <span className="text-sm text-red-500">IA</span>
                        <Progress value={(1 - result.humanityScore) * 100} className="w-full h-3 [&>*]:bg-gradient-to-r [&>*]:from-green-500 [&>*]:to-red-500 rounded-full bg-white/10" />
                        <span className="text-sm text-green-500">Humain</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
    </motion.div>
  );
}
