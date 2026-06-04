import axios from 'axios';
import fs from 'fs';
import path from 'path';
import prisma from '../lib/prisma.js';
import { generatePdf, generateCsv } from '../utils/generators.js';
import { sendSuccess, sendError } from 'shared';

const getInternalHeaders = () => ({
  'x-internal-key': process.env.INTERNAL_API_KEY || 'supersecretinternalkey'
});

const getOrGenerateReport = async (reportType, period, generatorFn) => {
  const now = new Date();
  
  // Look for a cached report that is still valid (less than 5 minutes old)
  const cached = await prisma.reportCache.findFirst({
    where: {
      reportType,
      period,
      expiresAt: { gt: now }
    },
    orderBy: { generatedAt: 'desc' }
  });

  if (cached) {
    return { payload: cached.payload, cacheId: cached.id };
  }

  // Generate new payload
  const payload = await generatorFn();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes cache

  const newCache = await prisma.reportCache.create({
    data: {
      reportType,
      period,
      payload,
      expiresAt
    }
  });

  return { payload, cacheId: newCache.id };
};

// Data Generator: Inventory
const getInventoryData = async (period) => {
  const extServiceUrl = process.env.EXTINGUISHER_SERVICE_URL || 'http://localhost:5003';
  const res = await axios.get(`${extServiceUrl}/internal/extinguishers`, {
    headers: getInternalHeaders()
  });
  const extinguishers = res.data.data;

  // Filter based on period (DAILY, MONTHLY, YEARLY, CUSTOM/all)
  const today = new Date();
  let filtered = [...extinguishers];
  
  if (period === 'DAILY') {
    filtered = extinguishers.filter(e => new Date(e.installationDate).toDateString() === today.toDateString());
  } else if (period === 'MONTHLY') {
    filtered = extinguishers.filter(e => {
      const inst = new Date(e.installationDate);
      return inst.getMonth() === today.getMonth() && inst.getFullYear() === today.getFullYear();
    });
  } else if (period === 'YEARLY') {
    filtered = extinguishers.filter(e => new Date(e.installationDate).getFullYear() === today.getFullYear());
  }

  const byType = {};
  const byStatus = {};
  const byBuilding = {};

  filtered.forEach(e => {
    byType[e.type] = (byType[e.type] || 0) + 1;
    byStatus[e.status] = (byStatus[e.status] || 0) + 1;
    if (e.building) {
      byBuilding[e.building] = (byBuilding[e.building] || 0) + 1;
    } else {
      byBuilding['Unknown'] = (byBuilding['Unknown'] || 0) + 1;
    }
  });

  return {
    period,
    total: filtered.length,
    byType,
    byStatus,
    byBuilding
  };
};

// Data Generator: Inspections
const getInspectionData = async () => {
  const inspServiceUrl = process.env.INSPECTION_SERVICE_URL || 'http://localhost:5004';
  const res = await axios.get(`${inspServiceUrl}/internal/inspections`, {
    headers: getInternalHeaders()
  });
  const inspections = res.data.data;

  let pending = 0;
  let completed = 0;
  let overdue = 0;
  const inspectorMap = {};

  inspections.forEach(i => {
    if (i.status === 'PENDING') pending++;
    else if (i.status === 'COMPLETED') completed++;
    else if (i.status === 'OVERDUE') overdue++;

    if (i.status === 'COMPLETED' && i.inspectorId) {
      inspectorMap[i.inspectorId] = (inspectorMap[i.inspectorId] || 0) + 1;
    }
  });

  const total = pending + completed + overdue;
  const completionRate = total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%';

  const byInspector = Object.entries(inspectorMap).map(([inspectorId, count]) => ({
    inspectorId,
    completed: count
  }));

  return {
    pending,
    completed,
    overdue,
    completionRate,
    byInspector
  };
};

// Data Generator: Compliance
const getComplianceData = async () => {
  const extServiceUrl = process.env.EXTINGUISHER_SERVICE_URL || 'http://localhost:5003';
  const res = await axios.get(`${extServiceUrl}/internal/extinguishers`, {
    headers: getInternalHeaders()
  });
  const extinguishers = res.data.data;

  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  let expired = 0;
  let expiringThisMonth = 0;
  let expiringNext30Days = 0;

  extinguishers.forEach(e => {
    const exp = new Date(e.expiryDate);
    if (e.status === 'EXPIRED' || exp < today) {
      expired++;
    } else {
      if (exp >= today && exp <= endOfMonth) {
        expiringThisMonth++;
      }
      if (exp >= today && exp <= thirtyDaysFromNow) {
        expiringNext30Days++;
      }
    }
  });

  const total = extinguishers.length;
  const compliantPercentage = total > 0 ? `${Math.round(((total - expired) / total) * 100)}%` : '100%';

  return {
    expired,
    expiringThisMonth,
    expiringNext30Days,
    compliantPercentage
  };
};

// Data Generator: Maintenance
const getMaintenanceData = async () => {
  const inspServiceUrl = process.env.INSPECTION_SERVICE_URL || 'http://localhost:5004';
  const extServiceUrl = process.env.EXTINGUISHER_SERVICE_URL || 'http://localhost:5003';
  
  const [inspRes, extRes] = await Promise.all([
    axios.get(`${inspServiceUrl}/internal/inspections`, { headers: getInternalHeaders() }),
    axios.get(`${extServiceUrl}/internal/extinguishers`, { headers: getInternalHeaders() }).catch(err => {
      console.warn('Failed to fetch extinguishers for serial mapping:', err.message);
      return { data: { data: [] } };
    })
  ]);
  
  const inspections = inspRes.data.data;
  const extinguishers = extRes.data.data || [];

  const extinguisherMap = {};
  extinguishers.forEach(e => {
    extinguisherMap[e.id] = e.serialNumber;
  });

  // Extract maintenance logs and enrich with extinguisher serial
  const logs = inspections
    .filter(i => i.maintenanceLog)
    .map(i => ({
      ...i.maintenanceLog,
      extinguisherSerial: extinguisherMap[i.extinguisherId] || 'Unknown'
    }));

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  let lastThirtyDays = 0;
  const extMap = {};

  logs.forEach(log => {
    const mDate = new Date(log.maintenanceDate);
    if (mDate >= thirtyDaysAgo && mDate <= today) {
      lastThirtyDays++;
    }
    extMap[log.extinguisherId] = (extMap[log.extinguisherId] || 0) + 1;
  });

  const byExtinguisher = Object.entries(extMap).map(([extinguisherId, count]) => ({
    extinguisherId,
    count
  }));

  // Sort logs by date desc to get recent
  const sortedLogs = [...logs].sort((a, b) => new Date(b.maintenanceDate) - new Date(a.maintenanceDate));
  const recentActivities = sortedLogs.slice(0, 10);

  return {
    totalActivities: logs.length,
    lastThirtyDays,
    byExtinguisher,
    recentActivities
  };
};

export const getInventoryReport = async (req, res, next) => {
  try {
    const period = (req.query.period || 'CUSTOM').toUpperCase();
    const { payload } = await getOrGenerateReport('INVENTORY', period, () => getInventoryData(period));
    return sendSuccess(res, payload, 'Inventory report retrieved');
  } catch (error) {
    next(error);
  }
};

export const getInspectionReport = async (req, res, next) => {
  try {
    const period = 'CUSTOM';
    const { payload } = await getOrGenerateReport('INSPECTION', period, getInspectionData);
    return sendSuccess(res, payload, 'Inspection report retrieved');
  } catch (error) {
    next(error);
  }
};

export const getComplianceReport = async (req, res, next) => {
  try {
    const period = 'CUSTOM';
    const { payload } = await getOrGenerateReport('COMPLIANCE', period, getComplianceData);
    return sendSuccess(res, payload, 'Compliance report retrieved');
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceReport = async (req, res, next) => {
  try {
    const period = 'CUSTOM';
    const { payload } = await getOrGenerateReport('MAINTENANCE', period, getMaintenanceData);
    return sendSuccess(res, payload, 'Maintenance report retrieved');
  } catch (error) {
    next(error);
  }
};

export const triggerExport = async (req, res, next) => {
  try {
    const { type } = req.params; // inventory, inspection, compliance, maintenance
    const { format, period } = req.body; // format: PDF/CSV, period: DAILY/MONTHLY/YEARLY/CUSTOM

    const reportTypeUpper = type.toUpperCase(); // INVENTORY, INSPECTION, etc.
    const periodUpper = (period || 'CUSTOM').toUpperCase();
    const formatUpper = (format || 'PDF').toUpperCase();

    if (!['INVENTORY', 'INSPECTION', 'COMPLIANCE', 'MAINTENANCE'].includes(reportTypeUpper)) {
      return sendError(res, 'Invalid report type', {}, 400);
    }
    if (!['PDF', 'CSV'].includes(formatUpper)) {
      return sendError(res, 'Invalid format. Supported: PDF, CSV', {}, 400);
    }

    // 1. Get or generate payload
    let dataGenerator;
    if (reportTypeUpper === 'INVENTORY') dataGenerator = () => getInventoryData(periodUpper);
    else if (reportTypeUpper === 'INSPECTION') dataGenerator = getInspectionData;
    else if (reportTypeUpper === 'COMPLIANCE') dataGenerator = getComplianceData;
    else if (reportTypeUpper === 'MAINTENANCE') dataGenerator = getMaintenanceData;

    const { payload, cacheId } = await getOrGenerateReport(reportTypeUpper, periodUpper, dataGenerator);

    // 2. Create export job
    const job = await prisma.exportJob.create({
      data: {
        reportCacheId: cacheId,
        requestedBy: req.user.id,
        format: formatUpper,
        status: 'PROCESSING'
      }
    });

    // 3. Generate file path
    const extension = formatUpper.toLowerCase();
    const filename = `${job.id}.${extension}`;
    const exportsDir = path.join(process.cwd(), 'public', 'exports');
    const filePath = path.join(exportsDir, filename);

    // 4. Generate file synchronously/async promise
    try {
      if (formatUpper === 'PDF') {
        await generatePdf(type, payload, filePath);
      } else {
        await generateCsv(type, payload, filePath);
      }

      // Update job
      const updatedJob = await prisma.exportJob.update({
        where: { id: job.id },
        data: {
          status: 'DONE',
          fileUrl: `/api/reports/exports/download/${filename}`
        }
      });

      return sendSuccess(res, updatedJob, 'Report export generated successfully');
    } catch (genError) {
      console.error('File generation error:', genError.message);
      await prisma.exportJob.update({
        where: { id: job.id },
        data: { status: 'FAILED' }
      });
      return sendError(res, 'Failed to generate export file', { details: genError.message }, 500);
    }
  } catch (error) {
    next(error);
  }
};

export const getExportJobStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await prisma.exportJob.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return sendError(res, 'Export job not found', {}, 404);
    }

    return sendSuccess(res, job, 'Export job status retrieved');
  } catch (error) {
    next(error);
  }
};

export const downloadExportFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'public', 'exports', filename);

    if (!fs.existsSync(filePath)) {
      return sendError(res, 'Export file not found', {}, 404);
    }

    return res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};
