// Static deployment mode utilities
// TODO: Remove when backend Pallet services are connected

export const isStaticDeployment = true;

export const logStaticAction = (action: string, data?: any) => {
  console.log(`[Static Mode] ${action}:`, data);
};

export const simulateApiDelay = (ms: number = 1500) => {
};

// Placeholder for future backend integration
export const getBackendUrl = () => {
  return process.env.VITE_BACKEND_URL || '';
};