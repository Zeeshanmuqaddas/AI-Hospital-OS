export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type AgentType = 'Clinical' | 'Finance' | 'SupplyChain' | 'Analytics' | 'Supervisor';

export interface AgentTask {
  id: string;
  agent: AgentType;
  task: string;
  priority: Priority;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface SystemInsight {
  id: string;
  agent: AgentType;
  message: string;
  timestamp: string;
}

export interface SystemState {
  supervisor_decision: string;
  agent_tasks: AgentTask[];
  insights: SystemInsight[];
  alerts: { id: string; message: string; severity: 'warning' | 'critical'; timestamp: string }[];
  resource_changes: { resource: string; change: string }[];
  confidence_score: number;
  emergency_mode: boolean;
}
