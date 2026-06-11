import React from 'react';
import jsPDF from 'jspdf';
import { useLocation } from 'react-router-dom';

export default function ReceiptPage() {
  const { state } = useLocation();
  const { payment } = state || {};

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("SmartTanker Payment Receipt", 20, 20);
    doc.text(`Transaction ID: ${payment.transactionId}`, 20, 40);
    doc.text(`Amount: ${payment.amount}`, 20, 50);
    doc.text(`Method: ${payment.method}`, 20, 60);
    doc.text(`Status: ${payment.status}`, 20, 70);

    doc.save("receipt.pdf");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Payment Receipt</h2>

      <button onClick={downloadPDF}>
        Download PDF
      </button>
    </div>
  );
}