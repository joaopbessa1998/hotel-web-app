import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

// Não preciso d tipar tão estritamente — recebemos o doc completo do Mongoose
export async function generateInvoicePdf(
  booking: any,
  hotel: any,
): Promise<string> {
  const invoicesDir = path.resolve('uploads', 'invoices');
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }
  const filename = `invoice-${booking._id}.pdf`;
  const outputPath = path.join(invoicesDir, filename);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Cabeçalho
    doc.fontSize(20).text('Fatura de Reserva', { align: 'center' }).moveDown();

    // Dados do hóspede
    // Ajustar confirmar estes campos ao Booking.model.ts
    doc
      .fontSize(12)
      .text(`Cliente: ${booking.guestName || booking.guest?.name || '—'}`)
      .text(`Email: ${booking.guestEmail || booking.guest?.email || '—'}`)
      .text(
        `Período: ${new Date(
          booking.startDate,
        ).toLocaleDateString()} – ${new Date(
          booking.endDate,
        ).toLocaleDateString()}`,
      )
      .moveDown();

    // Dados do hotel
    doc
      .text(`Hotel: ${hotel.name}`)
      .text(
        `Localização: ${hotel.address?.city || '—'}, ${
          hotel.address?.country || '—'
        }`,
      )
      .moveDown();

    // Valor
    doc
      .text(`Preço Total: €${(booking.totalPrice || 0).toFixed(2)}`)
      .moveDown(2);

    doc.text('Obrigado pela preferência!', { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve(`/uploads/invoices/${filename}`));
    stream.on('error', reject);
  });
}
