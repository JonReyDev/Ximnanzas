import { jsPDF } from 'jspdf';
import { projectOptimaxx, terms, type Quote } from './optimaxx.js';
import { formatCurrency } from './simulador.js';

const widths = [12, 12, 35, 40, 32, 34, 57, 51];
const headers = ['Año', 'Edad', 'Aportación anual', 'Aportación acumulada', 'Saldo del fondo', 'Saldo disponible', 'Saldo disponible neto de retención de impuestos de Allianz', 'Beneficio de deducibilidad acumulado reinvertido'];
const costs = [
  ['Aportación mensual', '10 años*', '15 años', '20 años', '25 años'],
  ['$2,000*', '2.99%', '2.47%', '2.14%', '1.97%'],
  ['$2,500', '2.74%', '2.28%', '1.99%', '1.84%'],
  ['$4,000', '2.41%', '2.06%', '1.81%', '1.69%'],
  ['$5,000', '2.30%', '1.97%', '1.75%', '1.64%'],
  ['$7,500', '2.10%', '1.87%', '1.65%', '1.56%'],
  ['$10,000', '2.07%', '1.83%', '1.62%', '1.53%'],
];

export function createOptimaxxPdf(quote: Quote): ArrayBuffer {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const margin = 12;
  const width = 273;
  let y = 26;
  const now = new Date();
  const validUntil = new Date(now.getTime() + 15 * 86400000);
  const date = (value: Date) => value.toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City' });
  const title = (label: string) => {
    doc.setFont('helvetica', 'bold').setFontSize(13).setTextColor('#102238');
    if (y > 181) { doc.addPage(); y = 18; }
    doc.text(label, margin, y);
    y += 7;
  };
  const paragraph = (text: string) => {
    doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor('#102238');
    for (const line of doc.splitTextToSize(text, width) as string[]) {
      if (y > 192) { doc.addPage(); y = 18; }
      doc.text(line, margin, y);
      y += 5;
    }
    y += 2;
  };
  const row = (cells: string[], columnWidths: number[], header: boolean, shaded = false) => {
    const height = header ? 12 : 7;
    if (header || shaded) {
      doc.setFillColor(header ? '#102238' : '#edf2f2');
      doc.rect(margin, y, columnWidths.reduce((a, b) => a + b), height, 'F');
    }
    doc.setFont('helvetica', header ? 'bold' : 'normal').setFontSize(8).setTextColor(header ? '#ffffff' : '#102238');
    let x = margin;
    cells.forEach((cell, index) => {
      const column = columnWidths[index];
      doc.text(doc.splitTextToSize(cell, column - 4), x + 2, y + 4.3);
      x += column;
    });
    y += height;
  };
  title('XIMNANZAS  |  Proyección ilustrativa OptiMaxx plus');
  paragraph(`Preparada para ${quote.name}. Generada el ${date(now)}. Vigencia de 15 días, hasta el ${date(validUntil)}.`);
  paragraph(`Art. 151 LISR · Edad inicial ${quote.age} · Plazo ${quote.years} años · Aportación inicial ${formatCurrency(quote.monthly)} al mes · Rendimiento anual supuesto ${quote.rate * 100}% · Inflación ${terms.inflation * 100}% · UDI inicial ilustrativa $${terms.udi}.`);
  title('Tabla de aportaciones por año (MXN)');
  row(headers, widths, true);
  projectOptimaxx(quote).forEach((item, index) => {
    if (y > 187) {
      doc.addPage();
      y = 18;
      title('Tabla de aportaciones por año (continuación)');
      row(headers, widths, true);
    }
    row([String(item.year), String(item.age), ...[item.annualPayment, item.totalPaid, item.fund, item.available, item.net].map(formatCurrency), quote.income ? formatCurrency(item.reinvested) : "Sin datos"], widths, false, index % 2 === 0);
  });
  doc.addPage();
  y = 19;
  title('Transparencia del producto — condiciones OptiMaxx plus');
  title('Saldo Inicial · meses 1 a 18');
  paragraph('Aportaciones de los primeros 18 meses más rendimientos, menos cargos. No admite retiros parciales durante el plazo comprometido. Gestión de 0.1% mensual y administración de 0.9% trimestral. Si no se cubren las aportaciones iniciales, Allianz puede cancelar la póliza. El folleto público 2025 indica 60 días desde la fecha programada para cubrirlas.');
  title('Saldo Comprometido · mes 19 en adelante');
  paragraph('Aportaciones comprometidas más rendimientos, menos cargos. Gestión de 0.1% mensual y cargo fijo de 15 UDIS al mes. Se permiten retiros parciales sujetos a las condiciones de la póliza, con mínimo de $10,000 y cargo del 1% sobre el retiro, más retención cuando aplique. También pueden solicitarse descanso, suspensión de aportaciones o préstamos, conforme al contrato.');
  title('Bono de Fidelidad');
  paragraph('Puede alcanzar el 100% de las aportaciones del primer año según el monto y plazo comprometidos. El folleto indica una tasa de inflación más 5 puntos porcentuales, con tope equivalente al 9% anual. Se aplican cargos. Antes de cumplir el plazo es informativo y queda fuera del saldo del fondo y del disponible de esta tabla. Se incorpora al vencimiento si se cumplen las condiciones del bono y las aportaciones están al corriente.');
  title('Cambios durante la vigencia');
  paragraph('No se modifican el contratante, el artículo de la LISR ni el plazo comprometido. Durante los meses 1 a 18 pueden actualizarse beneficiarios, medio de cobro, agente, distribución entre portafolios, ajuste por inflación y datos generales como domicilio, teléfono y RFC.');
  paragraph('Desde el mes 19 también pueden cambiarse monto y periodicidad de aportación, solicitar retiros parciales y realizar traspasos entre portafolios. La referencia de monto mínimo para retiro o traspaso es $10,000. Los retiros pueden afectar el Bono de Fidelidad.');
  title('Periodo de descanso');
  paragraph('Hasta 12 meses, una sola vez durante el contrato, estando al corriente y con aviso escrito al menos 5 días hábiles antes de la siguiente aportación. Las omisiones durante el descanso autorizado siguen las condiciones de la póliza para conservar el bono.');
  if (y > 128) { doc.addPage(); y = 18; }
  title('Costo total de referencia del plan');
  costs.forEach((cells, index) => row(cells, [55, 37, 37, 37, 37], index === 0, index % 2 === 1));
  y += 5;
  paragraph('Cifras de referencia facilitadas con la presentación Allianz México, Formación 2025. La fila de $2,000 y la columna de 10 años son extrapolaciones de referencia. Los porcentajes ponderados de esta tabla no se suman a los cargos ya modelados.');
  title('Supuestos fiscales y económicos');
  paragraph('Base histórica 2025: UMA diaria $113.14 y cinco UMA anuales, aproximadamente $206,368. Art. 151: la aportación elegible se limita al menor entre el 10% del ingreso anual acumulable y cinco UMA anuales. El PDF proyecta el tope y el ingreso con la inflación supuesta. El beneficio se estima con la tasa marginal declarada, hasta 35%, y su reinversión se muestra separada del fondo.');
  paragraph('El neto de esta tabla usa un escenario ilustrativo de retención provisional del 20% antes de los 65 años para Art. 151 y sin ese descuento desde los 65. La edad por sí sola no garantiza exención total. Art. 93: sin deducción de aportaciones y con exención sujeta a requisitos. Art. 185: límite legal de $152,000 anuales. La inflación no actualiza ese límite legal en esta simulación, y los retiros pueden ser ingresos acumulables. IVA general de referencia: 16%; la aplicación a los cargos depende del contrato.');
  paragraph('Simulación comercial informativa en pesos nominales. Los rendimientos y la inflación son supuestos, el valor de UDI es ilustrativo y los saldos se proyectan hasta el plazo mostrado. El saldo neto no es el ISR definitivo. La proyección no sustituye la cotización de Allianz ni las condiciones generales de la póliza.');
  paragraph('Fuentes: folleto público OptiMaxx plus 2025 de Allianz México y LISR, artículos 93, 151 y 185 (SAT).');
  return doc.output('arraybuffer');
}
