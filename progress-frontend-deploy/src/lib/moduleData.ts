export interface ModuleItem {
  screen_name: string;
  description: string;
  status: 'complete' | 'CPT_ready' | 'designed' | 'dev_in_progress';
}

// Hardcoded list of available modules
export const availableModules: ModuleItem[] = [
  { "screen_name": "Insights", "description": "Capture and store business ideas and personal insights with optional file attachments.", "status": "complete" },
  { "screen_name": "Reminders", "description": "Schedule and manage time-sensitive notifications for business activities.", "status": "complete" },
  { "screen_name": "Todo List", "description": "Track and organize daily tasks with priority levels and categories.", "status": "complete" },
  { "screen_name": "Goals", "description": "Set, track and achieve business objectives with progress monitoring.", "status": "complete" },
  { "screen_name": "Business Identity", "description": "Define core business details including mission, values, and brand voice.", "status": "complete" },
  { "screen_name": "Media Library", "description": "Store and organize business media assets and branded content.", "status": "complete" },
  { "screen_name": "CRM", "description": "Manage customer relationships, contacts, and interaction history.", "status": "CPT_ready" },
  { "screen_name": "Campaigns", "description": "Plan and execute marketing campaigns with tracking and analytics.", "status": "designed" },
  { "screen_name": "Sales", "description": "Track leads, deals, and sales pipeline with forecasting capabilities.", "status": "designed" },
  { "screen_name": "Content Studio", "description": "Create and manage blog posts, articles and other marketing content.", "status": "CPT_ready" },
  { "screen_name": "Analytics", "description": "Visualize business metrics and performance data across all modules.", "status": "designed" },
  { "screen_name": "Financial Dashboard", "description": "Track business finances, revenue streams, and expense categories.", "status": "designed" },
  { "screen_name": "Services", "description": "Define and manage business service offerings with pricing and details.", "status": "CPT_ready" },
  { "screen_name": "Universal Calendar", "description": "Unified calendar view showing all business events and deadlines.", "status": "complete" },
  { "screen_name": "Recruitment", "description": "Manage hiring process, track candidates, and schedule interviews.", "status": "designed" },
  { "screen_name": "Innovation Lab", "description": "Brainstorm and develop new business ideas and product concepts.", "status": "designed" },
  { "screen_name": "Knowledge Base", "description": "Create and organize internal documentation and business knowledge.", "status": "designed" },
  { "screen_name": "Project Management", "description": "Plan and track projects with tasks, timelines, and team assignments.", "status": "dev_in_progress" },
  { "screen_name": "Learning Plan", "description": "Create structured learning paths for business skills development.", "status": "designed" },
  { "screen_name": "Networking Hub", "description": "Manage professional connections and networking opportunities.", "status": "designed" },
  { "screen_name": "Success Stories", "description": "Document and showcase client success stories and case studies.", "status": "designed" },
  { "screen_name": "Meeting Mode", "description": "Streamline client meetings with agendas, notes, and action items.", "status": "designed" },
  { "screen_name": "API Credentials", "description": "Manage integrations with third-party services and platforms.", "status": "complete" },
  { "screen_name": "Canvas", "description": "Visual business planning and strategy development workspace.", "status": "designed" }
];

// Group modules by their status for easier display
export const groupModulesByStatus = () => {
  const groups = {
    'Ready to Install': availableModules.filter(m => m.status === 'complete'), 
    'Coming Soon - CPT Ready': availableModules.filter(m => m.status === 'CPT_ready'),
    'Coming Soon - Designed': availableModules.filter(m => m.status === 'designed'),
    'In Development': availableModules.filter(m => m.status === 'dev_in_progress')
  };
  
  return groups;
};

// Helper function to get status badge color
export const getStatusBadgeColor = (status: ModuleItem['status']): string => {
  switch (status) {
    case 'complete':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'CPT_ready':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'designed':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'dev_in_progress':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

// Helper function to get friendly status text for display
export const getStatusText = (status: ModuleItem['status']): string => {
  switch (status) {
    case 'complete':
      return 'Ready';
    case 'CPT_ready':
      return 'CPT Ready';
    case 'designed':
      return 'Designed';
    case 'dev_in_progress':
      return 'In Development';
    default:
      return status;
  }
};