import PDFDocument from 'pdfkit';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';

// Helper to ensure directory exists
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
};

export const generatePdf = (reportType, payload, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      ensureDirectoryExistence(filePath);
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fillColor('#1a365d').fontSize(22).text('TZW LTD', { align: 'left' });
      doc.fillColor('#4a5568').fontSize(10).text('Fire Extinguisher Management System', { align: 'left' });
      doc.moveDown(0.5);
      
      doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1.5);

      // Title
      doc.fillColor('#2d3748').fontSize(18).text(`${reportType.toUpperCase()} REPORT`, { align: 'center', underline: true });
      doc.moveDown();
      doc.fillColor('#718096').fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(2);

      // Details
      doc.fillColor('#2d3748').fontSize(14).text('Report Summary', { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(11).fillColor('#2d3748');

      if (reportType === 'inventory') {
        doc.text(`Report Period: ${payload.period || 'All-Time'}`);
        doc.text(`Total Extinguishers: ${payload.total}`);
        doc.moveDown();
        
        doc.text('Breakdown by Type:');
        Object.entries(payload.byType || {}).forEach(([k, v]) => {
          doc.text(`  - ${k}: ${v}`);
        });
        doc.moveDown();

        doc.text('Breakdown by Status:');
        Object.entries(payload.byStatus || {}).forEach(([k, v]) => {
          doc.text(`  - ${k}: ${v}`);
        });
        doc.moveDown();

        doc.text('Breakdown by Building:');
        Object.entries(payload.byBuilding || {}).forEach(([k, v]) => {
          doc.text(`  - ${k}: ${v}`);
        });
      } else if (reportType === 'inspection') {
        doc.text(`Pending Inspections: ${payload.pending}`);
        doc.text(`Completed Inspections: ${payload.completed}`);
        doc.text(`Overdue Inspections: ${payload.overdue}`);
        doc.text(`Completion Rate: ${payload.completionRate}`);
        doc.moveDown();

        doc.text('Completed Inspections by Inspector:');
        (payload.byInspector || []).forEach(ins => {
          doc.text(`  - Inspector ID: ${ins.inspectorId} | Completed: ${ins.completed}`);
        });
      } else if (reportType === 'compliance') {
        doc.text(`Expired Extinguishers: ${payload.expired}`);
        doc.text(`Expiring This Month: ${payload.expiringThisMonth}`);
        doc.text(`Expiring Next 30 Days: ${payload.expiringNext30Days}`);
        doc.text(`Compliance Percentage: ${payload.compliantPercentage}`);
      } else if (reportType === 'maintenance') {
        doc.text(`Total Maintenance Activities: ${payload.totalActivities}`);
        doc.text(`Activities in Last 30 Days: ${payload.lastThirtyDays}`);
        doc.moveDown();

        doc.text('Recent Maintenance History:', { underline: true });
        doc.moveDown(0.5);
        (payload.recentActivities || []).forEach(item => {
          const dateStr = new Date(item.maintenanceDate).toLocaleDateString();
          doc.text(`  - [${dateStr}] Extinguisher Serial: ${item.extinguisherSerial || 'Unknown'}`);
          doc.text(`    Action Taken: ${item.actionTaken}`);
          if (item.issuesIdentified) doc.text(`    Issues: ${item.issuesIdentified}`);
          doc.moveDown(0.5);
        });
      } else {
        doc.text(JSON.stringify(payload, null, 2));
      }

      // Footer
      doc.moveDown(4);
      doc.fillColor('#a0aec0').fontSize(8).text('Confidential - TZW LTD Internal Document', { align: 'center' });

      doc.end();
      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

export const generateCsv = async (reportType, payload, filePath) => {
  ensureDirectoryExistence(filePath);

  let headers = [];
  let records = [];

  if (reportType === 'inventory') {
    headers = [
      { id: 'metric', title: 'Metric Group' },
      { id: 'category', title: 'Category/Key' },
      { id: 'value', title: 'Value' }
    ];

    records.push({ metric: 'Summary', category: 'Report Period', value: payload.period || 'All-Time' });
    records.push({ metric: 'Summary', category: 'Total Extinguishers', value: payload.total });
    Object.entries(payload.byType || {}).forEach(([k, v]) => {
      records.push({ metric: 'By Type', category: k, value: v });
    });
    Object.entries(payload.byStatus || {}).forEach(([k, v]) => {
      records.push({ metric: 'By Status', category: k, value: v });
    });
    Object.entries(payload.byBuilding || {}).forEach(([k, v]) => {
      records.push({ metric: 'By Building', category: k, value: v });
    });
  } else if (reportType === 'inspection') {
    headers = [
      { id: 'metric', title: 'Metric' },
      { id: 'value', title: 'Value' }
    ];
    records.push({ metric: 'Pending', value: payload.pending });
    records.push({ metric: 'Completed', value: payload.completed });
    records.push({ metric: 'Overdue', value: payload.overdue });
    records.push({ metric: 'Completion Rate', value: payload.completionRate });
    (payload.byInspector || []).forEach(ins => {
      records.push({ metric: `Inspector ${ins.inspectorId} Completed`, value: ins.completed });
    });
  } else if (reportType === 'compliance') {
    headers = [
      { id: 'metric', title: 'Metric' },
      { id: 'value', title: 'Value' }
    ];
    records.push({ metric: 'Expired', value: payload.expired });
    records.push({ metric: 'Expiring This Month', value: payload.expiringThisMonth });
    records.push({ metric: 'Expiring Next 30 Days', value: payload.expiringNext30Days });
    records.push({ metric: 'Compliance Percentage', value: payload.compliantPercentage });
  } else if (reportType === 'maintenance') {
    headers = [
      { id: 'date', title: 'Date' },
      { id: 'extinguisherSerial', title: 'Extinguisher Serial' },
      { id: 'actionTaken', title: 'Action Taken' },
      { id: 'issuesIdentified', title: 'Issues Identified' },
      { id: 'recommendations', title: 'Recommendations' }
    ];
    (payload.recentActivities || []).forEach(item => {
      records.push({
        date: new Date(item.maintenanceDate).toLocaleDateString(),
        extinguisherSerial: item.extinguisherSerial || 'Unknown',
        actionTaken: item.actionTaken,
        issuesIdentified: item.issuesIdentified || 'None',
        recommendations: item.recommendations || 'None'
      });
    });
  } else {
    headers = [{ id: 'data', title: 'Raw Data JSON' }];
    records.push({ data: JSON.stringify(payload) });
  }

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: headers
  });

  await csvWriter.writeRecords(records);
  return filePath;
};
