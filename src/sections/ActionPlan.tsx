import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSimulation } from '@/context/SimulationContext';
import { AI_AGENTS, generateMockAnalysis, generateActionPlan } from '@/lib/ai-agents';
import type { ActionItem, Resource, Milestone } from '@/types/ai-agents';
import { CheckSquare, Clock, BookOpen, Target, Calendar, Check, Circle, ExternalLink, Trash2, RotateCcw } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function ActionPlan() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { decision, factors } = useSimulation();
  
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [activeTab, setActiveTab] = useState<'tasks' | 'resources' | 'milestones'>('tasks');
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('foresight_action_plan');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setActionItems(parsed.actionItems || []);
        setResources(parsed.resources || []);
        setMilestones(parsed.milestones || []);
      } catch (e) {
        console.error('Failed to load action plan:', e);
      }
    } else {
      // Generate initial action plan
      const analyses = AI_AGENTS.map(agent => generateMockAnalysis(agent.id, decision, factors));
      const plan = generateActionPlan(analyses, decision);
      setActionItems(plan.shortTerm.concat(plan.mediumTerm, plan.longTerm));
      setResources(plan.resources);
      setMilestones(plan.milestones);
    }
  }, [decision, factors]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('foresight_action_plan', JSON.stringify({
      actionItems,
      resources,
      milestones,
    }));
  }, [actionItems, resources, milestones]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
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

  const toggleTaskComplete = (id: string) => {
    setActionItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteTask = (id: string) => {
    setActionItems(prev => prev.filter(item => item.id !== id));
  };

  const resetPlan = () => {
    if (confirm('Are you sure you want to reset your action plan?')) {
      const analyses = AI_AGENTS.map(agent => generateMockAnalysis(agent.id, decision, factors));
      const plan = generateActionPlan(analyses, decision);
      setActionItems(plan.shortTerm.concat(plan.mediumTerm, plan.longTerm));
      setResources(plan.resources);
      setMilestones(plan.milestones);
    }
  };

  const filteredTasks = actionItems.filter(task => {
    if (filter === 'all') return true;
    return task.priority === filter;
  });

  const completedCount = actionItems.filter(t => t.completed).length;
  const progress = actionItems.length > 0 ? (completedCount / actionItems.length) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-emerald-400 bg-emerald-500/20';
      default: return 'text-foresight-text-muted bg-white/10';
    }
  };

  const getTimeframeLabel = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      default: return timeframe;
    }
  };

  return (
    <section
      ref={sectionRef}
      data-section="action-plan"
      className="relative w-full py-16 lg:py-24"
    >
      <div ref={contentRef} className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckSquare className="w-5 h-5 text-foresight-accent" />
            <span className="micro-label">ACTION PLAN</span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-foresight-text mb-4">
            Your Path Forward
          </h2>
          <p className="text-lg text-foresight-text-muted max-w-2xl mx-auto">
            Track your progress with personalized action items, resources, and milestones 
            from your AI advisors.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="glass-card-strong p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-foresight-text font-medium">Overall Progress</span>
            <span className="text-foresight-accent font-display text-xl">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-foresight-accent to-foresight-accent/60 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-foresight-text-muted mt-2">
            {completedCount} of {actionItems.length} tasks completed
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'tasks'
                  ? 'bg-foresight-accent text-white'
                  : 'bg-white/5 text-foresight-text-muted hover:bg-white/10'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              Tasks ({actionItems.filter(t => !t.completed).length})
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'resources'
                  ? 'bg-foresight-accent text-white'
                  : 'bg-white/5 text-foresight-text-muted hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Resources ({resources.length})
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'milestones'
                  ? 'bg-foresight-accent text-white'
                  : 'bg-white/5 text-foresight-text-muted hover:bg-white/10'
              }`}
            >
              <Target className="w-4 h-4" />
              Milestones ({milestones.length})
            </button>
          </div>
          
          <button
            onClick={resetPlan}
            className="text-sm text-foresight-text-muted hover:text-foresight-text flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'tasks' && (
            <>
              {/* Filter */}
              <div className="flex gap-2 mb-4">
                {(['all', 'high', 'medium', 'low'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilter(p)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize ${
                      filter === p
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-foresight-text-muted hover:bg-white/10'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                  <div className="glass-card p-8 text-center">
                    <CheckSquare className="w-12 h-12 text-foresight-text-muted/30 mx-auto mb-4" />
                    <p className="text-foresight-text-muted">No tasks found</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div 
                      key={task.id}
                      className={`glass-card p-4 flex items-start gap-4 transition-all ${
                        task.completed ? 'opacity-50' : ''
                      }`}
                    >
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                          task.completed
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-white/30 hover:border-foresight-accent'
                        }`}
                      >
                        {task.completed && <Check className="w-4 h-4 text-white" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-medium text-foresight-text ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                          </h4>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-foresight-text-muted/50 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-foresight-text-muted mt-1">{task.description}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-foresight-text-muted flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getTimeframeLabel(task.timeframe)}
                          </span>
                          <span className="text-xs text-foresight-text-muted/50">
                            via {task.agentSource}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'resources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource) => (
                <div key={resource.id} className="glass-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-foresight-accent/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-foresight-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-foresight-text">{resource.title}</h4>
                        <span className="text-xs text-foresight-text-muted uppercase">{resource.type}</span>
                      </div>
                      <p className="text-sm text-foresight-text-muted mt-1">{resource.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-foresight-text-muted/50">
                          Recommended by {resource.agentSource}
                        </span>
                        {resource.url && (
                          <a 
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-foresight-accent flex items-center gap-1 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Open
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="glass-card p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-foresight-accent/20 flex items-center justify-center">
                        <Target className="w-5 h-5 text-foresight-accent" />
                      </div>
                      {index < milestones.length - 1 && (
                        <div className="w-0.5 h-8 bg-white/10 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display text-lg text-foresight-text">{milestone.title}</h4>
                        <span className="text-xs text-foresight-accent bg-foresight-accent/10 px-2 py-1 rounded-full flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {milestone.targetDate}
                        </span>
                      </div>
                      <p className="text-sm text-foresight-text-muted mt-1">{milestone.description}</p>
                      <div className="mt-3 p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-foresight-text-muted">
                          <span className="text-foresight-text">Success Criteria:</span> {milestone.successCriteria}
                        </p>
                      </div>
                      <p className="text-xs text-foresight-text-muted/50 mt-2">
                        Set by {milestone.agentSource}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
