// components/ChildrenCsvUploader.js
import { useState } from 'react';
import firebase from 'firebase/app';
import { db, storage } from '../utils/firebase';
import Papa from 'papaparse';

function convertToFirestoreInt(noStr) {
  // If the dateStr is empty, return null
  if (!noStr) {
    return null;
  }

  const partNo = parseInt(noStr);
  return partNo;
}

const ChildrenCsvUploader = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setUploading(true);

    const bucketPath = 'gs://ligayasdg.appspot.com/SDG_Children.csv';
    const fileRef = storage.refFromURL(bucketPath);

    let downloadURL;
    try {
      downloadURL = await fileRef.getDownloadURL();
    } catch (error) {
      console.error('Error fetching download URL:', error);
      setUploading(false);
      return;
    }

    let childrenData = [];

    try {
      const response = await fetch(downloadURL);
      const csvString = await response.text();
      if (!response.ok) {
        throw new Error('Fetch request failed: ' + response.status);
      }
      const parsedData = Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        // Add more papaparse configuration options if needed
      });

      childrenData = parsedData.data;

      // Ensure that the 'no' field is converted to Firestore Int
      childrenData = childrenData.map((item) => ({
        ...item,
        no: convertToFirestoreInt(item.no),
        parent_no: convertToFirestoreInt(item.parent_no),
        // Convert other fields to Firestore Timestamp if needed
      }));

      console.log(childrenData);

      // Fetch all the master_data records to build a map of parent_no to master_data document IDs
      const masterDataSnapshot = await db.collection('master_data').get();
      const parentNoToIdMap = {};

      masterDataSnapshot.forEach((doc) => {
        const data = doc.data();
        const parentNo = data.parent_no;
        if (parentNo) {
          if (!parentNoToIdMap[parentNo]) {
            parentNoToIdMap[parentNo] = [doc.id];
          } else {
            parentNoToIdMap[parentNo].push(doc.id);
          }
        }
      });

      console.log(parentNoToIdMap);

      // Add subcollections to the corresponding master_data records
      const batch = db.batch();
      childrenData.forEach((child) => {
        const parentIds = parentNoToIdMap[child.no];
        if (parentIds) {
          parentIds.forEach((parentId) => {
            const childRef = db
              .collection('master_data')
              .doc(parentId)
              .collection('children')
              .doc();
            batch.set(childRef, child);
          });
        }
      });

      await batch.commit();
      alert('Children data subcollections have been successfully added!');
    } catch (error) {
      console.error('Error extracting data from CSV:', error);
    }

    setUploading(false);
  };

  return (
    <div>
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Children CSV from Cloud Bucket'}
      </button>
    </div>
  );
};

export default ChildrenCsvUploader;
