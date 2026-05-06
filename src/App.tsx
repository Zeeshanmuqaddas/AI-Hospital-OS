import { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Stethoscope, 
  BadgeDollarSign, 
  PackageSearch, 
  LineChart,
  Siren,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { AgentTask, SystemState, Priority, AgentType } from './types';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_STATE: SystemState = {
  supervisor_decision: "System initializing. Awaiting FHIR data stream and MCP module connections.",
  agent_tasks: [
    { id: '1', agent: 'Clinical', task: 'Triage incoming ER patients based on vitals', priority: 'high', status: 'in_progress' },
    { id: '2', agent: 'SupplyChain', task: 'Audit ICU ventilator availability', priority: 'medium', status: 'pending' },
    { id: '3', agent: 'Finance', task: 'Verify insurance eligibility for Ward 3 admissions', priority: 'low', status: 'completed' },
    { id: '4', agent: 'Analytics', task: 'Forecast bed occupancy for next 48h', priority: 'medium', status: 'in_progress' },
  ],
  insights: [
    { id: '1', agent: 'Analytics', message: 'Projected 15% increase in respiratory cases over next 3 days.', timestamp: new Date().toISOString() }
  ],
  alerts: [],
  resource_changes: [],
  confidence_score: 0.92,
  emergency_mode: false,
};

const AGENT_ICONS: Record<AgentType, React.ReactNode> = {
  Supervisor: <BrainCircuit className="w-5 h-5" />,
  Clinical: <Stethoscope className="w-5 h-5" />,
  Finance: <BadgeDollarSign className="w-5 h-5" />,
  SupplyChain: <PackageSearch className="w-5 h-5" />,
  Analytics: <LineChart className="w-5 h-5" />
};

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-slate-100 text-slate-700 border-slate-200',
  medium: 'bg-blue-100 text-blue-700 border-blue-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200 animate-pulse',
};

export default function App() {
  const [state, setState] = useState<SystemState>(INITIAL_STATE);
  const [ticker, setTicker] = useState(0);

  // Simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(t => t + 1);
    }, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (ticker === 0) return;

    // Simulate system events
    setState(prev => {
      const newState = { ...prev };
      
      // Randomly trigger emergency mode (5% chance)
      if (Math.random() < 0.05 && !prev.emergency_mode) {
        newState.emergency_mode = true;
        newState.supervisor_decision = "CRITICAL MODE ENGAGED. Overriding non-essential tasks. Allocating max resources to ER.";
        newState.alerts = [{
          id: Date.now().toString(),
          message: "Mass casualty incident reported. 12 ambulances en route.",
          severity: 'critical',
          timestamp: new Date().toISOString()
        }, ...prev.alerts].slice(0, 5);
        newState.confidence_score = 0.98;
      } 
      // Recover from emergency mode (20% chance if already in it)
      else if (Math.random() < 0.2 && prev.emergency_mode) {
        newState.emergency_mode = false;
        newState.supervisor_decision = "Emergency resolved. Returning to standard operational parameters.";
        newState.confidence_score = 0.89;
      }
      else if (!prev.emergency_mode) {
        // Normal operation updates
        const decisions = [
          "Optimizing nursing staff allocation for Night Shift based on Analytics forecast.",
          "Approved SupplyChain request for immediate restock of broad-spectrum antibiotics.",
          "Clinical assessment indicates stable patient vitals in ICU Ward A.",
          "Conflict resolved: Bed #402 allocated to high-risk patient over routine admission."
        ];
        newState.supervisor_decision = decisions[Math.floor(Math.random() * decisions.length)];
        // Add random task
        if (Math.random() > 0.5) {
          const newAgentPool: AgentType[] = ['Clinical', 'Finance', 'SupplyChain', 'Analytics'];
          const tasks = [
            "Review flagged patient lab results",
            "Generate cost-optimization report",
            "Monitor oxygen tank levels",
            "Update epidemiological trend model"
          ];
          newState.agent_tasks = [{
            id: Date.now().toString(),
            agent: newAgentPool[Math.floor(Math.random() * newAgentPool.length)],
            task: tasks[Math.floor(Math.random() * tasks.length)],
            priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as Priority,
            status: 'pending'
          }, ...prev.agent_tasks].slice(0, 8); // Keep last 8 tasks
        }
      }

      // Slightly fluctuate confidence
      newState.confidence_score = Math.max(0.75, Math.min(0.99, prev.confidence_score + (Math.random() * 0.04 - 0.02)));

      return newState;
    });
  }, [ticker]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 flex flex-col relative overflow-hidden ${state.emergency_mode ? 'bg-red-950 text-red-50' : 'bg-slate-950 text-slate-300'}`}>
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* Header */}
      <header className={`px-6 py-4 border-b flex items-center justify-between ${state.emergency_mode ? 'border-red-900 bg-red-900/50' : 'border-slate-800 bg-slate-900/50'} backdrop-blur-md sticky top-0 z-10`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${state.emergency_mode ? 'bg-red-600 text-white animate-pulse' : 'bg-indigo-600 text-white'}`}>
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">AI Hospital OS</h1>
            <p className={`text-xs ${state.emergency_mode ? 'text-red-300' : 'text-slate-400'}`}>Multi-Agent Autonomous Healthcare System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">System State</span>
            <div className="flex items-center gap-2 mt-1">
              {state.emergency_mode ? (
                <span className="flex items-center gap-1.5 text-sm font-medium text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">
                  <Siren className="w-4 h-4 animate-ping" />
                  CRITICAL SURGE
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  <Activity className="w-4 h-4" />
                  NOMINAL
                </span>
              )}
            </div>
          </div>
          
          <div className="h-10 w-px bg-slate-800 hidden sm:block"></div>
          
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Confidence</span>
            <span className={`text-xl font-mono font-bold mt-0.5 ${state.confidence_score > 0.9 ? 'text-emerald-400' : state.confidence_score > 0.8 ? 'text-yellow-400' : 'text-red-400'}`}>
              {(state.confidence_score * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* Left Column: Organization / Overview */}
        <div className="lg:col-span-3 lg:col-start-1 space-y-6 flex flex-col">
          
          {/* Supervisor Panel */}
          <div className={`rounded-xl border p-5 ${state.emergency_mode ? 'bg-red-900/20 border-red-800' : 'bg-slate-900 border-slate-800'} flex-1`}>
            <div className="flex items-center gap-2 mb-4 text-white">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
              <h2 className="font-semibold text-lg tracking-tight">Supervisor Brain</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Current Directive</h3>
                <div className={`p-3 rounded-lg border text-sm font-medium leading-relaxed ${state.emergency_mode ? 'bg-red-950 border-red-900 text-red-200' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
                  {state.supervisor_decision}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-800/50">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Sub-Agent Subsystems</h3>
                <div className="space-y-2">
                  {(['Clinical', 'Finance', 'SupplyChain', 'Analytics'] as AgentType[]).map(agent => (
                    <div key={agent} className="flex items-center justify-between p-2 rounded bg-slate-950/50 border border-slate-800/50">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">{AGENT_ICONS[agent]}</span>
                        <span className="text-sm font-medium text-slate-300">{agent}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs text-emerald-500 font-mono">ONLINE</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Middle Column: Agent Tasks */}
        <div className="lg:col-span-6 space-y-6 flex flex-col">
          
          <div className={`rounded-xl border flex-1 flex flex-col overflow-hidden ${state.emergency_mode ? 'bg-red-900/10 border-red-800/50' : 'bg-slate-900 border-slate-800'}`}>
            <div className={`p-4 border-b flex items-center justify-between ${state.emergency_mode ? 'border-red-900/50' : 'border-slate-800'}`}>
              <div className="flex items-center gap-2 text-white">
                <Activity className="w-5 h-5 text-blue-400" />
                <h2 className="font-semibold text-lg tracking-tight">Active Agent Tasks</h2>
              </div>
              <span className="text-xs font-mono text-slate-400">{state.agent_tasks.length} tracked</span>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              <AnimatePresence>
                {state.agent_tasks.map((task) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-3.5 rounded-lg border flex flex-col gap-3 ${state.emergency_mode ? 'bg-red-950/50 border-red-900/50' : 'bg-slate-950 border-slate-800'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                        <span className="p-1.5 rounded-md bg-slate-800 text-slate-300">
                          {AGENT_ICONS[task.agent]}
                        </span>
                        {task.agent} Agent
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold ${PRIORITY_COLORS[task.priority]}`}>
                        {task.priority}
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-300 leading-relaxed pl-9">
                      {task.task}
                    </p>

                    <div className="flex items-center gap-2 pl-9 mt-1">
                      {task.status === 'completed' ? (
                         <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5"/> Completed</span>
                      ) : task.status === 'in_progress' ? (
                         <span className="flex items-center gap-1 text-xs text-blue-400"><Clock className="w-3.5 h-3.5"/> Processing...</span>
                      ) : (
                         <span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="w-3.5 h-3.5"/> Pending</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {state.agent_tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-slate-500">
                  <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No active tasks</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Insights & Alerts */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          
          {/* Alerts Panel */}
          {state.alerts.length > 0 && (
            <div className={`rounded-xl border p-4 ${state.emergency_mode ? 'bg-red-900/30 border-red-500' : 'bg-red-950/20 border-red-900'} shadow-[0_0_15px_rgba(239,68,68,0.1)]`}>
              <div className="flex items-center gap-2 mb-3 text-red-400">
                <AlertTriangle className={`w-5 h-5 ${state.emergency_mode ? 'animate-pulse' : ''}`} />
                <h2 className="font-semibold text-lg tracking-tight">Active Alerts</h2>
              </div>
              <div className="space-y-3">
                {state.alerts.map((alert) => (
                  <div key={alert.id} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-200 font-medium">{alert.message}</p>
                    <span className="text-xs text-red-400/70 mt-2 block font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights Panel */}
          <div className={`rounded-xl border p-4 flex-1 ${state.emergency_mode ? 'bg-red-900/10 border-red-800' : 'bg-slate-900 border-slate-800'}`}>
            <div className="flex items-center gap-2 mb-4 text-white">
              <LineChart className="w-5 h-5 text-purple-400" />
              <h2 className="font-semibold text-lg tracking-tight">Agent Insights</h2>
            </div>
            <div className="space-y-3">
              {state.insights.map((insight) => (
                <div key={insight.id} className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
                   <div className="flex items-center gap-2 text-xs text-purple-400 mb-1.5 font-medium uppercase tracking-wider">
                      {AGENT_ICONS[insight.agent]}
                      {insight.agent} Insight
                   </div>
                   <p className="text-sm text-slate-300">{insight.message}</p>
                </div>
              ))}
              
              <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
                 <div className="flex items-center gap-2 text-xs text-blue-400 mb-1.5 font-medium uppercase tracking-wider">
                    {AGENT_ICONS.Finance}
                    Finance Insight
                 </div>
                 <p className="text-sm text-slate-300">Cost-per-patient trending 2.4% lower today due to optimal ICU discharge timing.</p>
              </div>
              
            </div>
          </div>

        </div>

      </main>
      
      {/* JSON Feed Footer */}
      <footer className={`border-t p-4 text-xs font-mono overflow-hidden whitespace-nowrap overflow-ellipsis ${state.emergency_mode ? 'bg-red-950 border-red-900 text-red-300/50' : 'bg-slate-950 border-slate-900 text-slate-500'}`}>
         <span className="text-slate-400 mr-2">LAST_SYSTEM_BROADCAST:</span> {JSON.stringify(state)}
      </footer>
    </div>
  );
}
