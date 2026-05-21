export const currentUser = {
  id: 'agent-1',
  name: 'Alex Rivera',
  email: 'alex.rivera@supportcentral.com',
  role: 'agent',
  department: 'Senior Agent',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const mockTickets = [
  {
    id: 'TKT-8429',
    title: 'Billing issue with annual subscription renewal',
    description: 'I noticed that my annual subscription was renewed yesterday at a higher rate than what was originally quoted in my account dashboard. I was expecting the discounted loyalty rate of $299/year, but I was charged the full price of $450.',
    status: 'open',
    priority: 'high',
    category: 'Billing & Payments',
    customerId: 'cust-1',
    customerName: 'Alex Johnson',
    customerEmail: 'alex.johnson@example.com',
    assignedAgentId: 'agent-1',
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    tags: ['SUBSCRIPTION', 'URGENT', 'LOYALTY_PROG'],
    slaDeadline: new Date(Date.now() + 840000).toISOString(), // 14 mins from now
    aiInsights: {
      suggestedCategory: 'Billing & Payments',
      sentiment: 'frustrated',
      suggestedResponse: 'User sentiment appears frustrated. Mentioning the 2019 start date could help de-escalate.'
    }
  },
  {
    id: 'TKT-8821',
    title: 'Unable to access enterprise dashboard',
    description: 'Customer reporting 403 errors when attempting to load the analytics module for the past 24 hours. They have multiple users affected.',
    status: 'open',
    priority: 'urgent',
    category: 'Technical',
    customerId: 'cust-2',
    customerName: 'Sarah Jenkins',
    customerEmail: 's.jenkins@enterprise.com',
    assignedAgentId: 'agent-1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    tags: ['ENTERPRISE', 'WEB_APP'],
    slaDeadline: new Date(Date.now() + 720000).toISOString(), // 12 mins from now
  },
  {
    id: 'TKT-8819',
    title: 'Billing discrepancy on annual plan',
    description: 'Client was charged twice during the migration from monthly to annual billing cycle. Needs urgent refund of the second transaction.',
    status: 'pending',
    priority: 'medium',
    category: 'Billing',
    customerId: 'cust-3',
    customerName: 'Marcus Thorne',
    customerEmail: 'm.thorne@startup.io',
    assignedAgentId: 'agent-1',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
    tags: ['REFUND', 'DUPLICATE_CHARGE'],
  }
];
