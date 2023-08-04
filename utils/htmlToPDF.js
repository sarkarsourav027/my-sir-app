
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const generatePDF = async (elementId, fileName) => {
    const element = document.getElementById(elementId);

    try {
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(fileName);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};

export default generatePDF;