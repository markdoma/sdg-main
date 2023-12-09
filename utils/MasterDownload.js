import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import * as XLSX from 'xlsx';
import moment from 'moment';
import FileSaver from 'file-saver';

import { db } from './firebase';

// // ... your Firebase config ...

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// const db = firebase.firestore();

function MasterDownload() {
  const [allDocs, setAllDocs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all documents from the database
      const snapshot = await db.collectionGroup('master_data').get();

      // Extract data and format timestamps
      const allDocs = snapshot.docs.map((doc) => {
        const formattedData = doc.data();
        // if (formattedData.timestamp) {
        //   formattedData.timestamp = moment(formattedData.timestamp).format(
        //     'YYYY-MM-DD HH:mm:ss'
        //   );

        //   // formattedData.timestamp = 'this is Date';
        // }

        if (
          formattedData.hasOwnProperty('birthdate') &&
          formattedData.birthdate
        ) {
          formattedData.birthdate = formattedData.birthdate.toDate();
          // .toISOString()
          // .slice(0, 10);
        }

        if (
          formattedData.hasOwnProperty('weddingdate') &&
          formattedData.weddingdate
        ) {
          formattedData.weddingdate = formattedData.weddingdate.toDate();
          // .toISOString()
          // .slice(0, 10);
        }
        return formattedData;
      });

      setAllDocs(allDocs);
      console.log(allDocs);
    };
    fetchData();
  }, []);

  const handleDownloadExcel = () => {
    // Prepare a workbook
    const workbook = XLSX.utils.book_new();

    // Create a single worksheet with formatted timestamps
    const worksheet = XLSX.utils.json_to_sheet(allDocs.map((doc) => doc));

    // Add the sheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'master_data');

    // Convert workbook to blob and trigger download
    const file = XLSX.writeFile(workbook, 'all_docs.xlsx');
    const blob = new Blob([file], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(blob, 'all_docs.xlsx');
  };

  return (
    <div>
      <h1>All Documents</h1>
      <button onClick={handleDownloadExcel}>Download as Excel</button>
      {/* You can display additional information about documents here */}
    </div>
  );
}

export default MasterDownload;
