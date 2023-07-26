// pages/pdf.js
import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import { db } from "../utils/firebase"; // Replace with your Firestore initialization code
import QRCode from "qrcode.react";

const PdfDocument = ({ data }) => (
  <PDFViewer width="100%" height="600px">
    <div>
      <h1>PDF Content:</h1>
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <div>{item.name}</div>
          {/* Customize the data fields according to your Firestore document structure */}
          <div>
            <QRCode value={item.qrCode} size={64} />
          </div>
        </React.Fragment>
      ))}
    </div>
  </PDFViewer>
);

const Pdf = ({ data }) => {
  //   return <h1>{data}</h1>;
  return <PdfDocument data={data} />;
};

export async function getServerSideProps() {
  try {
    // const firestore = getFirestore(); // Replace with your Firestore initialization code
    const snapshot = await db.collection("master").get();
    const data = snapshot.docs.map((doc) => doc.data());

    // Generate PDF using the html-to-pdf package
    const pdfBlob = await pdf(<Pdf data={data} />).toBlob();
    const pdfBuffer = await pdfBlob.arrayBuffer();
    const pdfDataUri = `data:application/pdf;base64,${Buffer.from(
      pdfBuffer
    ).toString("base64")}`;

    return {
      props: { pdfDataUri },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      notFound: true,
    };
  }
}

export default Pdf;
