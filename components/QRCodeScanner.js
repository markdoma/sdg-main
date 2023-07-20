import { useState, useRef } from "react";
import dynamic from "next/dynamic";

const QrScanner = dynamic(() => import("react-qr-scanner"), { ssr: false });

const QRCodeScanner = ({ onScan, resetScanResult }) => {
  const [scanResult, setScanResult] = useState("");
  const [isScanned, setIsScanned] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const qrReaderRef = useRef(null);
  const dummyData = [
    {
      qrCode: "dummy-qr-code-1",
      name: "John Doe",
      age: 25,
      email: "john.doe@example.com",
    },
    {
      qrCode: "dummy-qr-code-3",
      name: "Jane Smith",
      age: 30,
      email: "jane.smith@example.com",
    },
    // Add more dummy records here
  ];

  const handleScan = (data) => {
    if (data && !isScanned) {
      setScanResult(data);
      setIsScanned(true);
      onScan(data);

      const foundRecord = dummyData.find(
        (record) => record.qrCode === data.text
      );

      if (foundRecord) {
        console.log("QR code already exists:", foundRecord);
        // Display "QR code already exists" message
      } else {
        console.log("QR code does not exist in the database");
        // Display "QR code does not exist" message
      }
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const handleResetScanResult = () => {
    setScanResult("");
    setIsScanned(false);
    setScanKey((prevKey) => prevKey + 1); // Update the key value to retrigger scan
  };

  return (
    <div className="flex justify-center items-start h-screen">
      <div className="w-full max-w-md">
        <div className="my-4">
          <QrScanner
            key={scanKey} // Add key prop to trigger a re-render and reset the QR scanner
            ref={qrReaderRef}
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%", height: "400px" }} // Adjust the height to make the camera larger
            legacyMode={!isScanned}
            facingMode="environment" // Set the facing mode to "environment" for back camera (default)
          />
          {scanResult && (
            <div className="mt-4">
              <p>Scanned QR Code: {scanResult.text}</p>
              <p>Raw Bytes: {scanResult.rawBytes}</p>
              <p>Num Bits: {scanResult.numBits}</p>
              {/* Render other necessary properties */}
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleResetScanResult}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            >
              Scan QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;
