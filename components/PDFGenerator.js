import React, { useEffect, useState, useRef } from "react";
import QRCode from "qrcode.react";
import { db } from "../utils/firebase";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas"; // Import html2canvas

const PdfGenerator = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = db.collection("master").onSnapshot((snapshot) => {
      const fetchedMembers = snapshot.docs.map((doc) => doc.data());
      setMembers(fetchedMembers);
      setLoading(false);
    });

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unsubscribe();
    };
  }, []);

  const generatePdf = async (member) => {
    const doc = new jsPDF();

    // Set up the PDF content
    doc.setFontSize(16).text(`Name: ${member.firstname}`, 20, 20);
    doc.setFontSize(16).text(`Email: ${member.lastname}`, 20, 30);
    // Add more data fields as needed

    // Render the QR code in a hidden div using qrcode.react
    const qrCodeRef = useRef(null); // Define qrCodeRef here

    // Use html2canvas to convert the hidden div to a canvas
    await html2canvas(qrCodeRef.current, {
      scale: 5, // Adjust the scale as needed for better image quality
    }).then((canvas) => {
      const qrCodeDataURL = canvas.toDataURL();

      // Add the QR code image to the PDF
      const imgWidth = 50;
      const imgHeight = 50;
      doc.addImage(qrCodeDataURL, "PNG", 20, 40, imgWidth, imgHeight);

      doc.save(`member_${member.id}.pdf`);
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {members.map((member) => (
        <div key={member.id}>
          {/* Hidden div to render the QR code */}
          <div style={{ display: "none" }} ref={qrCodeRef}>
            <QRCode value={member.qrcode} size={100} />
          </div>
          {/* Generate PDF for each member */}
          <button onClick={() => generatePdf(member)}>Download PDF</button>
        </div>
      ))}
    </div>
  );
};

export default PdfGenerator;
