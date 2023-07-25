import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const QrScanner = dynamic(() => import("react-qr-scanner"), { ssr: false });

const QRCodeScanner = ({ onScan, resetScanResult }) => {
  const [facingMode, setFacingMode] = useState("environment");
  const [scanResult, setScanResult] = useState("");
  const [isScanned, setIsScanned] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const qrReaderRef = useRef(null);
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

  // useEffect(() => {
  //   // Access the camera stream with the initial facing mode
  //   navigator.mediaDevices
  //     .getUserMedia({ video: { facingMode: "environment" } })
  //     .then((stream) => {
  //       if (qrReaderRef.current) {
  //         qrReaderRef.current.srcObject = stream;
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error accessing the camera:", error);
  //     });
  // }, []);

  const toggleCameraFacingMode = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === "environment" ? "user" : "environment"
    );
    // Reset the QR scanner by updating the key and triggering a re-render
    setScanKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="flex justify-center items-start h-screen">
      <div className="w-full max-w-md">
        <div className="my-4">
          <div className="relative">
            {/* QR Scanner */}
            <QrScanner
              key={scanKey} // Add key prop to trigger a re-render and reset the QR scanner
              ref={qrReaderRef}
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%", height: "400px" }} // Adjust the height to make the camera larger
              legacyMode={!isScanned}
              // facingMode={{
              //   exact: "environment",
              // }}
              // facingMode="environment"
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
