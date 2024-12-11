import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from '../constants/currencies';
import { ReportPeriod } from '../hooks/useReportData';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportReport = async (data: {
  period: ReportPeriod;
  periodData: any[];
  summaryData: {
    income: number;
    expenses: number;
    netCashFlow: number;
  };
  categoryData: { name: string; value: number; }[];
}) => {
  // Initialize PDF with standard font
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true
  });

  // Set RTL mode and default font size
  doc.setR2L(true);
  doc.setFontSize(14);
  doc.setTextColor(33, 33, 33);

  // Add title
  doc.setFontSize(20);
  doc.text('التقرير المالي', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  doc.setFontSize(14);

  // Add summary table
  doc.autoTable({
    head: [['صافي التدفق النقدي', 'إجمالي المصروفات', 'إجمالي الدخل']],
    body: [[
      formatCurrency(data.summaryData.netCashFlow, 'SAR'),
      formatCurrency(data.summaryData.expenses, 'SAR'),
      formatCurrency(data.summaryData.income, 'SAR'),
    ]],
    startY: 30,
    styles: {
      fontSize: 12,
      halign: 'right',
      cellPadding: 5,
      overflow: 'linebreak',
      font: 'helvetica'
    },
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: 255,
      fontSize: 12,
      fontStyle: 'bold'
    },
    theme: 'grid',
    tableWidth: 'auto',
    margin: { left: 10, right: 10 }
  });

  // Add period data
  doc.autoTable({
    head: [['صافي', 'مصروفات', 'دخل', 'الفترة']],
    body: data.periodData.map(row => [
      formatCurrency(row.صافي, 'SAR'),
      formatCurrency(row.مصروفات, 'SAR'),
      formatCurrency(row.دخل, 'SAR'),
      row.period,
    ]),
    startY: doc.lastAutoTable.finalY + 10,
    styles: {
      fontSize: 12,
      halign: 'right',
      cellPadding: 5,
      overflow: 'linebreak',
      font: 'helvetica'
    },
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: 255,
      fontSize: 12,
      fontStyle: 'bold'
    },
    theme: 'grid',
    tableWidth: 'auto',
    margin: { left: 10, right: 10 }
  });

  // Add category breakdown
  doc.autoTable({
    head: [['المبلغ', 'الفئة']],
    body: data.categoryData.map(cat => [
      formatCurrency(cat.value, 'SAR'),
      cat.name,
    ]),
    startY: doc.lastAutoTable.finalY + 10,
    styles: {
      fontSize: 12,
      halign: 'right',
      cellPadding: 5,
      overflow: 'linebreak',
      font: 'helvetica'
    },
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: 255,
      fontSize: 12,
      fontStyle: 'bold'
    },
    theme: 'grid',
    tableWidth: 'auto',
    margin: { left: 10, right: 10 }
  });

  // Add footer with date
  const today = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  doc.setFontSize(10);
  doc.text(`تاريخ التقرير: ${today}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { 
    align: 'right' 
  });

  // Save the PDF
  doc.save('financial-report.pdf');
};