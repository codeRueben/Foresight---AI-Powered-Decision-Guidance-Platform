import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSimulation } from '../context/SimulationContext';
import { Download, Share2, Check, Sparkles, Heart, Brain, TrendingUp, Zap } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

gsap.registerPlugin(ScrollTrigger);

export function Reflection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { 
    decision, 
    simulationResult, 
    saveScenario, 
    savedScenarios,
    totalSimulations,
    insightPattern,
    decisionConfidence 
  } = useSimulation();
  
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;

    if (!section || !card) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSave = () => {
    saveScenario();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportPDF = async () => {
    if (!cardRef.current || !simulationResult) return;
    
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#07080B',
        scale: 2,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`foresight-decision-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My Foresight Decision',
      text: `I just simulated: "${decision}" using Foresight.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Link copied to clipboard!');
    }
  };

  const getEmotionLabel = (value: number) => {
    if (value >= 80) return 'Excited';
    if (value >= 60) return 'Hopeful';
    if (value >= 40) return 'Cautious';
    if (value >= 20) return 'Uncertain';
    return 'Anxious';
  };

  return (
    <section
      ref={sectionRef}
      data-section="reflection"
      className="relative w-full min-h-screen flex items-center justify-center py-20"
    >
      <div
        ref={cardRef}
        className="w-full max-w-[700px] mx-6 glass-card-strong p-6 lg:p-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-foresight-accent" />
            <span className="micro-label">REFLECTION</span>
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-light text-foresight-text mb-3">
            How does this future feel?
          </h2>
          <p className="text-foresight-text-muted">
            Save this scenario. Come back after a week. Compare what changes.
          </p>
        </div>

        {/* Decision summary */}
        {decision && (
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-foresight-text-muted mb-1">Your decision</p>
            <p className="text-foresight-text font-medium line-clamp-2">&ldquo;{decision}&rdquo;</p>
          </div>
        )}

        {/* Simulation results preview */}
        {simulationResult && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <Brain className="w-5 h-5 text-foresight-accent mx-auto mb-2" />
              <p className="text-lg font-display text-foresight-text">
                {getEmotionLabel(simulationResult.threeMonths.emotional.value)}
              </p>
              <p className="text-[10px] text-foresight-text-muted uppercase tracking-wider">3 months</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <p className="text-lg font-display text-foresight-text">
                {simulationResult.oneYear.financial.value > 0 ? '+' : ''}
                {simulationResult.oneYear.financial.value}%
              </p>
              <p className="text-[10px] text-foresight-text-muted uppercase tracking-wider">1 year growth</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <Heart className="w-5 h-5 text-rose-400 mx-auto mb-2" />
              <p className="text-lg font-display text-foresight-text">
                {simulationResult.fiveYears.emotional.value}%
              </p>
              <p className="text-[10px] text-foresight-text-muted uppercase tracking-wider">5 year wellbeing</p>
            </div>
          </div>
        )}

        {/* Insight pattern */}
        {insightPattern && (
          <div className="mb-6 p-4 rounded-xl bg-foresight-accent/10 border border-foresight-accent/30">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-foresight-accent" />
              <span className="text-xs text-foresight-accent font-medium">Your pattern</span>
            </div>
            <p className="text-sm text-foresight-text">{insightPattern}</p>
          </div>
        )}

        {/* Confidence meter */}
        {decisionConfidence > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-foresight-text-muted uppercase tracking-wider">Decision confidence</span>
              <span className="text-sm text-foresight-accent font-medium">{decisionConfidence}%</span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-foresight-accent via-foresight-accent/80 to-foresight-accent/60 transition-all duration-1000 rounded-full"
                style={{ width: `${decisionConfidence}%` }}
              />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleSave}
            className={`btn-primary flex items-center justify-center gap-2 py-3 ${
              isSaved ? 'bg-emerald-500/20 border-emerald-500/50' : ''
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-sm">Saved!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Save</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="btn-secondary flex items-center justify-center gap-2 py-3"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">{isExporting ? '...' : 'PDF'}</span>
          </button>

          <button
            onClick={handleShare}
            className="btn-secondary flex items-center justify-center gap-2 py-3"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </button>
        </div>

        {/* Stats footer */}
        <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-xs text-foresight-text-muted">
          <div className="flex gap-4">
            <span>{totalSimulations} simulations</span>
            <span>{savedScenarios.length} saved</span>
          </div>
          <span>Built for clarity. Not certainty.</span>
        </div>
      </div>
    </section>
  );
}
