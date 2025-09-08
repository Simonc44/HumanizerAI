'use client';

import { useState, useTransition } from 'react';
import { analyzeTextHumanity, type AnalyzeTextHumanityOutput } from '@/ai/flows/analyze-text-humanity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { LoaderCircle, BotMessageSquare } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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
        setError("Une erreur s'est produite lors de l'analyse du texte. Veuillez réessayer.");
        console.error(e);
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score < 0.4) return 'hsl(var(--chart-2))'; // Vert pour humain
    if (score < 0.75) return 'hsl(var(--chart-4))'; // Jaune pour mix
    return 'hsl(var(--destructive))'; // Rouge pour IA
  };

  const getScoreText = (score: number) => {
    if (score < 0.4) return "Très probablement écrit par un humain.";
    if (score < 0.75) return "Pourrait être un mélange d'IA et d'humain.";
    return "Très probablement généré par une IA.";
  }

  return (
    <>
      <Card className="w-full shadow-lg border-border bg-card rounded-xl">
        <CardContent className="p-6">
          <div className="grid gap-4">
            <Textarea
              placeholder="Collez le texte que vous souhaitez analyser ici..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] text-base resize-y focus:ring-primary bg-input rounded-lg"
              disabled={isPending}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleAnalyze} disabled={isPending || !inputText.trim()} size="lg" className="justify-self-end bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 rounded-lg">
              {isPending ? (
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <BotMessageSquare className="mr-2 h-5 w-5" />
              )}
              Analyser le Texte
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isPending && (
          <motion.div 
            className="text-center my-12 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LoaderCircle className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-muted-foreground font-medium">Analyse en cours...</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
      {result && !isPending && (
        <motion.div 
          className="mt-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Card className="shadow-lg border-2 border-blue-600 bg-card rounded-xl">
            <CardHeader>
              <CardTitle>Résultats de l'Analyse</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex flex-col items-center gap-4">
                <div className="w-full">
                    <p className="text-lg font-semibold" style={{ color: getScoreColor(result.humanityScore)}}>
                        {getScoreText(result.humanityScore)}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                        <span className="text-sm text-green-400">Humain</span>
                        <Progress value={(1 - result.humanityScore) * 100} className="w-full h-3 [&>*]:bg-gradient-to-r [&>*]:from-green-400 [&>*]:to-red-500" />
                        <span className="text-sm text-red-500">IA</span>
                    </div>
                </div>
                <p className="text-5xl font-bold mt-4" style={{ color: getScoreColor(result.humanityScore)}}>
                    {Math.round(result.humanityScore * 100)}%
                    <span className="text-2xl text-muted-foreground"> IA Score</span>
                </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
