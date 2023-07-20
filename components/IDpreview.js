import React, { useRef } from "react";
import PrintButton from "./PrintButton";
import QRCode from "qrcode.react";

const dummyData = [
  {
    qrCode: "dummy-qr-code-1",
    name: "Elle Doma",
    age: 25,
    email: "john.doe@example.com",
  },
  {
    qrCode: "dummy-qr-code-3",
    name: "Mark Doma",
    age: 30,
    email: "mark@doma.com",
  },
  {
    qrCode: "dummy-qr-code-1",
    name: "Jeanne Doma",
    age: 25,
    email: "jeanne@doma.com",
  },
  {
    qrCode: "dummy-qr-code-3",
    name: "Biboy Doma",
    age: 30,
    email: "biboy@doma.com",
  },
  {
    qrCode: "dummy-qr-code-1",
    name: "Tess",
    age: 25,
    email: "tess@doma.com",
  },

  // Add more dummy data as needed
];

const IDPreview = () => {
  const contentToPrintRef = useRef(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">QR Codes</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {dummyData.map((data, index) => (
          <div
            key={index}
            className={`relative border rounded-lg overflow-hidden ${
              data.name === "Tess" ? "md:col-span-4" : "md:col-span-1"
            }`}
          >
            {/* Card content */}
            <div className="h-80 flex flex-col justify-center items-center bg-gray-100">
              {/* Display the QR code */}
              <QRCode value={data.qrCode} size={120} />
            </div>
            <div className="p-4">
              <div className="text-xl font-bold">{data.name}</div>
              <div className="flex justify-between items-center">
                <div className="text-sm">{data.age}</div>
                <div className="text-sm text-gray-600">{data.email}</div>
              </div>
              {/* Place PrintButton in the top-right corner */}
              <div className="absolute top-2 right-2">
                <PrintButton
                  contentToPrint={contentToPrintRef}
                  filename={`id_preview_${data.qrCode}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IDPreview;
