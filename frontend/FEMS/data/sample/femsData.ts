/**
 * Sample / seed data for TZW FEMS
 * Used as placeholder in charts while live API data is loading.
 * Do NOT use this in final renders — all components must use live API data.
 */

export const sampleInspectionChartData = [
  { month: 'Jul', completed: 12, scheduled: 18 },
  { month: 'Aug', completed: 19, scheduled: 22 },
  { month: 'Sep', completed: 14, scheduled: 20 },
  { month: 'Oct', completed: 23, scheduled: 25 },
  { month: 'Nov', completed: 18, scheduled: 21 },
  { month: 'Dec', completed: 15, scheduled: 19 },
  { month: 'Jan', completed: 20, scheduled: 24 },
  { month: 'Feb', completed: 25, scheduled: 27 },
  { month: 'Mar', completed: 22, scheduled: 28 },
  { month: 'Apr', completed: 30, scheduled: 32 },
  { month: 'May', completed: 28, scheduled: 35 },
  { month: 'Jun', completed: 26, scheduled: 30 },
];

export const sampleInventoryReport = {
  total: 142,
  byType: { CO2: 45, DryPowder: 62, Water: 35 },
  byStatus: {
    ACTIVE: 98,
    INACTIVE: 14,
    EXPIRED: 18,
    UNDER_MAINTENANCE: 12,
  },
  byBuilding: { 'Block A': 42, 'Block B': 55, 'Block C': 45 },
};

export const sampleInspectionReport = {
  pending: 24,
  completed: 118,
  overdue: 6,
  cancelled: 3,
  completionRate: 87.4,
  byInspector: [],
  monthly: sampleInspectionChartData,
};

export const sampleComplianceReport = {
  expired: 18,
  expiringThisMonth: 5,
  expiringNext30Days: 11,
  compliantPercentage: 87.3,
};
