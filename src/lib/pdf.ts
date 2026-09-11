import { jsPDF } from 'jspdf';
import { formatCurrency, type ProjectionYear } from './Simulador';

type PDFParams = {
  age: number;
  monthly: number;
  years: number;
  profile: string;
  rate: number;
};

async function loadLogoDataUrl() {
  const response = await fetch('/Ximnanzas_Logo.png');
  if (!response.ok) throw new Error('No se pudo cargar el logo de Ximnanzas');

  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function generateProjectionPDF(projection: ProjectionYear[], params: PDFParams) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;
  const margin = 20;
  let y = 0;
  let logoDataUrl: string | null = null;

  try {
    logoDataUrl = await loadLogoDataUrl();
  } catch {
    // El documento puede generarse aunque el recurso de marca no cargue.
  }

  const drawHeader = () => {
    doc.setFillColor(15, 32, 80);
    doc.rect(0, 0, pageW, 45, 'F');
    doc.setFillColor(47, 112, 245);
    doc.rect(0, 45, pageW, 2, 'F');

    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', margin, 4, 27, 34);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Proyeccion financiera', margin + 35, 22);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(142, 188, 255);
    doc.text('Plan Personal de Retiro', margin + 35, 32);
    doc.setFontSize(9);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, pageW - margin, 22, { align: 'right' });
  };

  drawHeader();

  y = 60;

  // Parameters box
  doc.setFillColor(238, 245, 255);
  doc.roundedRect(margin, y, pageW - margin * 2, 30, 3, 3, 'F');
  doc.setTextColor(15, 32, 80);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Parametros de la proyeccion', margin + 5, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 51, 51);
  const paramText = `Edad actual: ${params.age} anos  |  Aporte mensual: ${formatCurrency(params.monthly)}  |  Plazo: ${params.years} anos  |  Perfil: ${params.profile} (${(params.rate * 100).toFixed(0)}% anual)`;
  doc.text(paramText, margin + 5, y + 20, { maxWidth: pageW - margin * 2 - 10 });

  y += 40;

  // Summary
  const final = projection[projection.length - 1];
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 32, 80);
  doc.text('Resultado final', margin, y);
  y += 8;

  doc.setFontSize(24);
  doc.setTextColor(47, 112, 245);
  doc.text(formatCurrency(final.balance), margin, y + 5);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Total aportado: ${formatCurrency(final.totalContributed)}   |   Interes generado: ${formatCurrency(final.interest)}   |   Edad final: ${params.age + params.years} anos`, margin, y);
  y += 12;

  // Table header
  doc.setFillColor(15, 32, 80);
  doc.rect(margin, y, pageW - margin * 2, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  const cols = [
    { label: 'Ano', x: margin + 5, w: 20 },
    { label: 'Edad', x: margin + 25, w: 20 },
    { label: 'Aportado (ano)', x: margin + 50, w: 35 },
    { label: 'Total aportado', x: margin + 90, w: 35 },
    { label: 'Interes generado', x: margin + 130, w: 30 },
    { label: 'Saldo final', x: margin + 160, w: 30 },
  ];
  cols.forEach((c) => doc.text(c.label, c.x, y + 7));
  y += 10;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const rowH = 7;
  const maxRowsPerPage = Math.floor((pageH - margin - y - 10) / rowH);

  projection.forEach((row, i) => {
    if (i > 0 && i % maxRowsPerPage === 0) {
      doc.addPage();
      drawHeader();
      y = 60;
      doc.setFillColor(15, 32, 80);
      doc.rect(margin, y, pageW - margin * 2, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      cols.forEach((c) => doc.text(c.label, c.x, y + 7));
      y += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
    }

    if (i % 2 === 0) {
      doc.setFillColor(245, 248, 252);
      doc.rect(margin, y, pageW - margin * 2, rowH, 'F');
    }
    doc.setTextColor(51, 51, 51);
    doc.text(String(row.year), cols[0].x, y + 5);
    doc.text(String(row.age), cols[1].x, y + 5);
    doc.text(formatCurrency(row.contribution), cols[2].x, y + 5);
    doc.text(formatCurrency(row.totalContributed), cols[3].x, y + 5);
    doc.text(formatCurrency(row.interest), cols[4].x, y + 5);
    doc.setTextColor(47, 112, 245);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(row.balance), cols[5].x, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    y += rowH;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', margin, pageH - 27, 14, 18);
    }
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      'Proyeccion de retiro personalizada',
      margin + 18,
      pageH - 14,
      { align: 'center' },
    );
    doc.text(`Pagina ${p} de ${pageCount}`, pageW - margin, pageH - 14, { align: 'right' });
  }

  doc.save('proyeccion-retiro.pdf');
}
