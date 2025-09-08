'use client';

import { useState, useTransition } from 'react';
import type { HumanizeTextOutput } from '@/ai/flows/humanize-text';
import { humanizeText } from '@/ai/flows/humanize-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, LoaderCircle, Wand2 } from 'lucide-react';

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [inputText, setInputText] = useState(
    "In the contemporary digital landscape, the optimization of user experience (UX) is a pivotal factor for the success of web-based platforms. It is imperative to conduct a comprehensive analysis of user interaction patterns to ascertain key areas for strategic enhancement. By leveraging data-driven insights, we can architect more intuitive navigational structures and streamline conversion funnels, thereby maximizing user engagement and retention metrics."
  );
  const [originalText, setOriginalText] = useState('');
  const [result, setResult] = useState<HumanizeTextOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleHumanize = () => {
    if (!inputText.trim()) {
      setError('Please enter some text to humanize.');
      return;
    }

    setError(null);
    setResult(null);
    setOriginalText(inputText);

    startTransition(async () => {
      try {
        const res = await humanizeText({ text: inputText });
        setResult(res);
      } catch (e) {
        setError('An error occurred while humanizing the text. Please try again.');
        console.error(e);
      }
    });
  };

  const handleCopy = () => {
    if (result?.humanizedText) {
      navigator.clipboard.writeText(result.humanizedText);
      toast({
        title: 'Copied to clipboard!',
        description: 'The humanized text has been copied.',
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return 'hsl(var(--destructive))';
    if (score < 75) return 'hsl(var(--chart-4))';
    return 'hsl(var(--chart-2))';
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-500">
              Humanizer AI
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your AI-generated text into content that reads like it was written by a human.
            </p>
          </header>

          <Card className="w-full shadow-2xl border-border bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid gap-4">
                <Textarea
                  placeholder="Paste your text here to make it more human..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] text-base resize-y focus:ring-primary bg-transparent"
                  disabled={isPending}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button onClick={handleHumanize} disabled={isPending || !inputText.trim()} size="lg" className="justify-self-end bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg transition-all duration-300 hover:shadow-primary/40 active:scale-95">
                  {isPending ? (
                    <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-5 w-5" />
                  )}
                  Humanize Text
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
              >
                <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Analyzing and rewriting your text...</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
          {result && !isPending && (
            <motion.div 
              className="mt-10 grid md:grid-cols-2 gap-8 items-start"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
            >
              <motion.div variants={cardVariants}>
                <Card className="shadow-lg h-full bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground/80">Original</CardTitle>
                    <CardDescription>
                      Humanity Score:
                      <span className="font-bold ml-2" style={{ color: getScoreColor(result.originalScore) }}>
                        {result.originalScore}%
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-foreground/80 leading-relaxed p-4 border rounded-md bg-muted/30 max-h-[400px] overflow-y-auto text-sm">
                      {originalText}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Card className="shadow-xl border-2 border-primary h-full bg-card/50">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle>Humanized</CardTitle>
                        <CardDescription>
                          Humanity Score:
                          <span className="font-bold ml-2" style={{ color: getScoreColor(result.humanizedScore) }}>
                            {result.humanizedScore}%
                          </span>
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={handleCopy} className="shrink-0 text-primary/80 hover:text-primary hover:bg-primary/10">
                        <Copy className="h-5 w-5" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-foreground leading-relaxed p-4 rounded-md text-base">
                      {result.humanizedText}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
