// components/CsvUploader.js
import { useState } from "react";
import { db, storage } from "../utils/firebase"; // Import the Firebase configuration
import Papa from "papaparse"; // Import papaparse library
import GoogleAuth from "../components/GoogleAuth";

const CsvUploader = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setUploading(true);

    // const bucketPath = "gs://ligayasdg.appspot.com/SDG_DB.csv";
    const bucketPath = "gs://ligayasdg.appspot.com/test.csv";
    const fileRef = storage.refFromURL(bucketPath);

    let downloadURL;
    try {
      downloadURL = await fileRef.getDownloadURL();
    } catch (error) {
      console.error("Error fetching download URL:", error);
      setUploading(false);
      return;
    }

    let data = [];

    try {
      const response = await fetch(downloadURL, { mode: "no-cors" });
      // const response = await fetch(downloadURL);
      const csvString = await response.text();
      if (!response.ok) {
        throw new Error("Fetch request failed: " + response.status);
      }
      // Parse the CSV data using papaparse
      const parsedData = Papa.parse(csvString, {
        header: true, // Treat the first row as the header row containing column names
        skipEmptyLines: true, // Skip empty lines in the CSV
        // Add more papaparse configuration options if needed
      });

      data = parsedData.data; // Extract the data array from the parsed result
      console.log(data);
    } catch (error) {
      console.error("Error extracting data from CSV:", error);
      setUploading(false);
      return;
    }

    try {
      const dataCollection = db.collection("test");
      await Promise.all(data.map((item) => dataCollection.add(item)));
      alert("CSV data has been successfully uploaded to Firestore!");
    } catch (error) {
      console.error("Error uploading data to Firestore:", error);
    }

    setUploading(false);
  };

  return (
    <div>
      <GoogleAuth />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload CSV from Cloud Bucket"}
      </button>
    </div>
  );
};

export default CsvUploader;
