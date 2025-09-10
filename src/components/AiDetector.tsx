'use client';

import { useState, useTransition, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { LoaderCircle, BotMessageSquare } from 'lucide-react';
import { analyzeTextHumanity, type AnalyzeTextHumanityOutput } from '@/ai/flows/analyze-text-humanity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';


function AnimatedScore({ score }: { score: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, score, { duration: 1, ease: "easeOut" });
    return controls.stop;
  }, [score, count]);

  return <motion.span>{rounded}</motion.span>;
}

export function AiDetector() {
  const [isPending, startTransition] = useTransition();
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<AnalyzeTextHumanityOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        setResult(res);
      } catch (e) {
        setError("Une erreur s'est produite lors de l'analyse. Veuillez réessayer.");
        console.error(e);
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score > 0.6) return 'text-red-400';
    if (score > 0.3) return 'text-yellow-400';
    return 'text-green-400';
  };
  
  const getScoreText = (score: number) => {
    if (score > 0.6) return "Probablement généré par une IA";
    if (score > 0.3) return "Sûrement un mix IA/Humain";
    return "Probablement écrit par un humain";
  }

  const humanScore = result ? Math.round((1 - result.humanityScore) * 100) : 0;

  return (
    <motion.div>
    <Card className="w-full shadow-2xl rounded-2xl bg-card/50 backdrop-blur-xl border-white/10">
      <CardContent className="p-6">
        <div className="grid gap-4">
          <div className={cn("relative", isPending && 'scanner')}>
            <Textarea
              placeholder="Collez le texte à analyser..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[250px] text-base rounded-lg bg-black/20 focus-visible:ring-primary/80 border-white/10 text-white placeholder:text-white/70"
              disabled={isPending}
            />
          </div>
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
              <AnimatePresence>
                {isPending && (
                  <motion.div 
                    className="flex flex-col items-center gap-2 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-sm text-muted-foreground font-medium animate-pulse">Analyse en cours...</p>
                    <p className="text-xs text-muted-foreground/50">Veuillez patienter pendant que notre IA évalue votre texte.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {result && !isPending && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
                    className="text-center"
                  >
                    <p className="text-lg font-medium mb-2">{getScoreText(result.humanityScore)}</p>
                    <h3 className={`text-6xl font-bold ${getScoreColor(result.humanityScore)}`}>
                      <AnimatedScore score={humanScore} />%
                      <span className="text-2xl text-muted-foreground font-normal ml-2">Humain</span>
                    </h3>
                    <div className="flex items-center gap-4 mt-4 max-w-sm mx-auto">
                      <span className="text-sm text-red-400">IA</span>
                      <Progress value={humanScore} className="w-full h-3 [&>*]:bg-gradient-to-r [&>*]:from-green-400 [&>*]:to-red-400 rounded-full bg-white/10" />
                      <span className="text-sm text-green-400">Humain</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
    </motion.div>
  );
}
