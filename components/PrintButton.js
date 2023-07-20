import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PrintButton = ({ contentToPrint, filename }) => {
  const handlePrint = () => {
    const input = document.getElementById(contentToPrint);

    html2canvas(input).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297); // Adjust width and height as needed (A4 size: 210x297mm)
      pdf.save(`${filename}.pdf`);
    });
  };

  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-md shadow mr-4"
      onClick={handlePrint}
    >
      Print
    </button>
  );
};

export default PrintButton;
