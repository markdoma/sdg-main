// components/CsvUploader.js
import { useState } from 'react';
import firebase from 'firebase/app';
import { db, storage } from '../utils/firebase'; // Import the Firebase configuration
import Papa from 'papaparse'; // Import papaparse library
import GoogleAuth from '../components/GoogleAuth';

function convertToFirestoreTimestamp(dateStr) {
  // If the dateStr is empty, return null
  if (!dateStr) {
    return null;
  }

  // Split the date string into parts: day, month, and year
  const [day, month, year] = dateStr.split('/');

  // Create a new Date object by providing the year, month (0-indexed), and day
  const date = new Date(year, parseInt(month) - 1, day);

  const timestamp = firebase.firestore.Timestamp.fromDate(date);

  // Convert the JavaScript Date object to a Firestore Timestamp
  // return db.Timestamp.fromDate(date);
  return timestamp;
}

function convertToFirestoreInt(noStr) {
  // If the dateStr is empty, return null
  if (!noStr) {
    return null;
  }

  const partNo = parseInt(noStr);
  return partNo;
}

const CsvUploader = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setUploading(true);

    // const bucketPath = "gs://ligayasdg.appspot.com/SDG_DB.csv";
    const bucketPath = 'gs://ligayasdg.appspot.com/SDG_DB_latest_2.csv';
    const fileRef = storage.refFromURL(bucketPath);

    let downloadURL;
    try {
      downloadURL = await fileRef.getDownloadURL();
    } catch (error) {
      console.error('Error fetching download URL:', error);
      setUploading(false);
      return;
    }

    let data = [];

    try {
      // const response = await fetch(downloadURL, { mode: "no-cors" });
      const response = await fetch(downloadURL);
      const csvString = await response.text();
      if (!response.ok) {
        throw new Error('Fetch request failed: ' + response.status);
      }
      // Parse the CSV data using papaparse
      const parsedData = Papa.parse(csvString, {
        header: true, // Treat the first row as the header row containing column names
        skipEmptyLines: true, // Skip empty lines in the CSV
        // Add more papaparse configuration options if needed
      });

      const convertToJSON = (firstName, lastName) => {
        return JSON.stringify({
          firstname: firstName,
          lastname: lastName,
        });
      };

      data = parsedData.data; // Extract the data array from the parsed result

      // Transform the data array to update the timestamp field to Firestore Timestamp objects
      data = data.map((item) => ({
        ...item,
        no: convertToFirestoreInt(item.no), //Parse No
        parent_no: convertToFirestoreInt(item.parent_no), //Parse Parent_No
        qrcode: convertToJSON(item.firstname, item.lastname),
        insert_date: convertToFirestoreTimestamp(item.insert_date), // Replace 'insert_date' with the actual field name in your CSV
        update_date: convertToFirestoreTimestamp(item.update_date), // Replace 'update_date' with the actual field name in your CSV
        birthdate: convertToFirestoreTimestamp(item.birthdate), // Replace 'birthdate' with the actual field name in your CSV
        weddingdate: convertToFirestoreTimestamp(item.weddingdate), // Replace 'weddingdate' with the actual field name in your CSV
      }));

      console.log(data);
    } catch (error) {
      console.error('Error extracting data from CSV:', error);
      setUploading(false);
      return;
    }

    try {
      const dataCollection = db.collection('master_data');
      await Promise.all(data.map((item) => dataCollection.add(item)));
      alert('CSV data has been successfully uploaded to Firestore!');
    } catch (error) {
      console.error('Error uploading data to Firestore:', error);
    }

    setUploading(false);
  };

  return (
    <div>
      <GoogleAuth />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload CSV from Cloud Bucket'}
      </button>
    </div>
  );
};

export default CsvUploader;
