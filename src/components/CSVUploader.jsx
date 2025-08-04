'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';

const CSVUploader = () => {
    const [csvData, setCsvData] = useState([]);

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                setCsvData(results.data);
            },
        });
    };

    const handleUpload = async () => {
        if (!csvData.length) return;

        const headers = Object.keys(csvData[0]);

        // Send headers and data to backend
        const res = await fetch('/api/upload-csv', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ headers, data: csvData }),
        });

        const result = await res.json();
        alert(result.message);
    };

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFileUpload} />
            <button onClick={handleUpload}>Upload to Appwrite</button>
        </div>
    );
};

export default CSVUploader;
