import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Standard Turkish Character Replacement Helper
 * Useful for jsPDF standard fonts which often fail on Turkish glyphs
 */
const tr = (str) => {
  if (!str) return '';
  return str
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C');
};

export const generateInvoicePDF = (invoice) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Header & Branding
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59); // var(--color-text)
  doc.text('DORE ADEM', 20, 30);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // var(--color-muted)
  doc.text('Premium Cicek Butigi', 20, 37);

  // 2. Invoice Info (Top Right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(tr('SATIS FATURASI'), pageWidth - 20, 30, { align: 'right' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`No: ${invoice.invoiceNumber}`, pageWidth - 20, 38, { align: 'right' });
  doc.text(`Tarih: ${new Date(invoice.invoiceDate).toLocaleDateString('tr-TR')}`, pageWidth - 20, 44, { align: 'right' });
  doc.text(`ETTN: ${invoice._id.toUpperCase()}`, pageWidth - 20, 50, { align: 'right' });

  // 3. Billing Info Grid
  // Seller (Left)
  const startY = 65;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('SATICI', 20, startY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(tr('Dore Adem'), 20, startY + 6);
  doc.text(tr('Adres: Nisantasi, Istanbul'), 20, startY + 11);
  doc.text(tr('Vergi Dairesi: Sisli'), 20, startY + 16);
  doc.text(tr('Vergi No: 9876543210'), 20, startY + 21);
  doc.text(tr('MERSIS: 0987654321000001'), 20, startY + 26);

  // Buyer (Right)
  doc.setFont('helvetica', 'bold');
  doc.text('ALICI', 110, startY);
  doc.setFont('helvetica', 'normal');
  doc.text(tr(invoice.customerType === 'corporate' ? invoice.taxDetails?.companyName : invoice.billingAddress?.fullName), 110, startY + 6);
  doc.text(tr(invoice.billingAddress?.address), 110, startY + 11, { maxWidth: 80 });
  doc.text(tr(`${invoice.billingAddress?.district}, ${invoice.billingAddress?.city}`), 110, startY + 22);
  doc.text(tr(invoice.customerType === 'corporate' ? `V.N.: ${invoice.taxDetails?.taxId} / V.D.: ${invoice.taxDetails?.taxOffice}` : `TC NO: ${invoice.taxDetails?.tcNo}`), 110, startY + 27);

  // 4. Items Table
  const tableData = invoice.items.map((item, index) => [
    index + 1,
    tr(item.name),
    item.quantity,
    `${item.price.toLocaleString('tr-TR')} TL`,
    `%${item.vat || 20}`,
    `${((item.price * item.quantity * (item.vat || 20)) / 100).toLocaleString('tr-TR')} TL`,
    `${item.total.toLocaleString('tr-TR')} TL`
  ]);

  doc.autoTable({
    startY: 105,
    head: [[tr('Sira'), tr('Urun Adı'), tr('Miktar'), tr('Birim Fiyat'), tr('KDV %'), tr('KDV Tutarı'), tr('Toplam')]],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 9, font: 'helvetica' },
    styles: { fontSize: 8, font: 'helvetica', cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 10 },
      2: { halign: 'center' },
      3: { halign: 'right' },
      4: { halign: 'center' },
      5: { halign: 'right' },
      6: { halign: 'right', fontStyle: 'bold' }
    }
  });

  // 5. Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'normal');
  doc.text(tr('Ara Toplam:'), pageWidth - 60, finalY);
  doc.text(`${invoice.totals.subtotal.toLocaleString('tr-TR')} TL`, pageWidth - 20, finalY, { align: 'right' });

  doc.text(tr('KDV Toplamı (%20):'), pageWidth - 60, finalY + 7);
  doc.text(`${invoice.totals.taxTotal.toLocaleString('tr-TR')} TL`, pageWidth - 20, finalY + 7, { align: 'right' });

  doc.setLineWidth(0.5);
  doc.line(pageWidth - 70, finalY + 10, pageWidth - 20, finalY + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(tr('GENEL TOPLAM:'), pageWidth - 60, finalY + 16);
  doc.text(`${invoice.totals.grandTotal.toLocaleString('tr-TR')} TL`, pageWidth - 20, finalY + 16, { align: 'right' });

  // 6. Signature / Notes
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(tr('Notlar: ') + tr(invoice.notes || 'Bizi tercih ettiginiz icin tesekkur ederiz.'), 20, finalY + 30);
  
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(tr('Bu belge elektronik ortamda olusturulmustur.'), pageWidth / 2, 285, { align: 'center' });

  // Save/View
  doc.save(`Fatura-${invoice.invoiceNumber}.pdf`);
};
