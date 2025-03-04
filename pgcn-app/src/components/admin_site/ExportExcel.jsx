import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx'; // ✅ Fix: Use named import

const ExcelExport = ({ data, fileName, buttonStatus }) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return ( 

    <>
        { buttonStatus === true &&  
            <button onClick={exportToExcel} type="button" 
                className="btn btn-primary w-100" 
                disabled={false}>
                Export to Excel
            </button>
        } 
        
        { buttonStatus === false &&  
            <button onClick={exportToExcel} type="button" 
                className="btn btn-primary w-100" 
                disabled={true}>
                Export to Excel
            </button>
        } 
    </>
  );
}

export default ExcelExport;
