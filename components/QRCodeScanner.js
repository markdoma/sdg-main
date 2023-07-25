import React, { useState, useRef, useEffect } from "react";
import { QrReader } from "react-qr-reader-extended";

const QRCodeScanner = ({ onScan, resetScanResult }) => {
  const [facingMode, setFacingMode] = useState("environment");
  const [scanResult, setScanResult] = useState(null);
  const [isScanned, setIsScanned] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const qrReaderRef = useRef(null);
  // const dummyData = [
  //   // ... dummy data ...
  // ];

  const handleScan = (data) => {
    if (data && !isScanned) {
      // Stop scanning after getting a result
      qrReaderRef.current.stopScanning();

      setScanResult(data);
      setIsScanned(true);
      onScan(data);

      const foundRecord = dummyData.find((record) => record.qrCode === data);

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
    setScanResult(null);
    setIsScanned(false);
    setScanKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    if (qrReaderRef.current && facingMode) {
      qrReaderRef.current.openImageDialog(); // Request user permission to use the camera
    }
  }, [facingMode]);

  const toggleCameraFacingMode = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === "user" ? "environment" : "user"
    );

    setScanResult(null);
    setIsScanned(false);
    setScanKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="flex justify-center items-start h-screen">
      <div className="w-full max-w-md">
        <div className="my-4">
          <div className="relative">
            {/* QR Reader */}
            <QrReader
              key={scanKey}
              ref={qrReaderRef}
              // onError={handleError}
              onResult={handleScan}
              style={{ width: "100%", height: "400px" }}
              facingMode={facingMode}
            />

            {/* Button to toggle the camera */}
            <button
              onClick={toggleCameraFacingMode}
              className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Switch Camera
            </button>
          </div>
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
