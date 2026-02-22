import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { OrbHero } from './sections/OrbHero';
import { DecisionInput } from './sections/DecisionInput';
import { AgentConsultation } from './sections/AgentConsultation';
import { ComprehensiveResults } from './sections/ComprehensiveResults';
import { ActionPlan } from './sections/ActionPlan';
import { SimulationThreeMonths } from './sections/SimulationThreeMonths';
import { SimulationOneYear } from './sections/SimulationOneYear';
import { SimulationFiveYears } from './sections/SimulationFiveYears';
import { BranchingPaths } from './sections/BranchingPaths';
import { Reflection } from './sections/Reflection';
import { Navigation } from './components/Navigation';
import { SidePanel } from './components/SidePanel';
import { GradientMesh } from './components/GradientMesh';
import { SimulationProvider } from './context/SimulationContext';
import { AuthProvider } from './context/AuthContext';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const SECTIONS = [
  { id: 'hero', label: 'Home', icon: 'home' },
  { id: 'decision', label: 'Your Decision', icon: 'edit' },
  { id: 'agent-consultation', label: 'AI Advisors', icon: 'users' },
  { id: 'comprehensive-results', label: 'Report', icon: 'file' },
  { id: 'action-plan', label: 'Action Plan', icon: 'check' },
  { id: '3months', label: '3 Months', icon: 'calendar' },
  { id: '1year', label: '1 Year', icon: 'calendar' },
  { id: '5years', label: '5 Years', icon: 'calendar' },
  { id: 'branching', label: 'Paths', icon: 'git' },
  { id: 'reflection', label: 'Reflect', icon: 'heart' },
];

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Setup section tracking
    const sections = gsap.utils.toArray<HTMLElement>('[data-section]');
    
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setCurrentSection(index),
        onEnterBack: () => setCurrentSection(index),
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [isLoaded]);

  const scrollToSection = (index: number) => {
    const sections = gsap.utils.toArray<HTMLElement>('[data-section]');
    if (sections[index]) {
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: sections[index], offsetY: 80 },
        ease: 'power2.inOut',
      });
    }
  };

  return (
    <AuthProvider>
    <SimulationProvider>
      <div 
        className={`relative min-h-screen bg-foresight-bg transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Persistent gradient mesh background */}
        <GradientMesh />
        
        {/* Navigation */}
        <Navigation />
        
        {/* Side Panel Navigation */}
        <SidePanel 
          sections={SECTIONS}
          currentSection={currentSection}
          onSelect={scrollToSection}
        />

        {/* Main content - with left margin for side panel */}
        <main ref={mainRef} className="relative z-10 ml-0 lg:ml-64">
          <OrbHero />
          <DecisionInput />
          <AgentConsultation />
          <ComprehensiveResults />
          <ActionPlan />
          <SimulationThreeMonths />
          <SimulationOneYear />
          <SimulationFiveYears />
          <BranchingPaths />
          <Reflection />
        </main>
      </div>
    </SimulationProvider>
    </AuthProvider>
  );
}

export default App;
