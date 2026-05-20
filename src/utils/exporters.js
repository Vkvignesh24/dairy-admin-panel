import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportExcel(filename, rows) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportPdf(title, columns, rows) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'A4',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title, 40, 40);

  autoTable(doc, {
    startY: 60,

    head: [columns.map((c) => c.label)],

    body: rows.map((r) =>
      columns.map((c) => {
        let value =
          typeof c.value === 'function'
            ? c.value(r)
            : r[c.key];

        // SAFE VALUE CONVERSION
        if (value === null || value === undefined) return '';

        // FIX CURRENCY RENDERING
        if (
          c.key === 'subtotal' ||
          c.key === 'deliveryFee' ||
          c.key === 'total'
        ) {
          return String(value)
            .replace('₹', 'Rs. ')
            .trim();
        }

        return String(value);
      })
    ),

    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 6,
      overflow: 'linebreak',
      valign: 'middle',
      textColor: [30, 41, 59],
    },

    headStyles: {
      fillColor: [16, 185, 129],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },

    bodyStyles: {
      fillColor: [255, 255, 255],
    },

    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },

    margin: {
      left: 30,
      right: 30,
    },

    tableWidth: 'auto',
  });

  doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
}

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB') : '-';

export const fmtMoney = (n) =>
  `₹${Number(n || 0).toFixed(2)}`;