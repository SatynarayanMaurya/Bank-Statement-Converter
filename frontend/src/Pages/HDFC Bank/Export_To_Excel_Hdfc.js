import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcelHdfc = (data, fileName = 'transactions') => {
  if (!data || data.length === 0) {
    console.error("No data to export");
    return;
  }

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
  { wch: 15 }, // width for 'date' column
  { wch: 40 }, // width for 'narration'
  { wch: 20 }, // width for 'Ref no'
  { wch: 15 }, // width for 'value date'
  { wch: 12 }, // width for 'amount'
  { wch: 12 }, // width for 'amount'
  { wch: 12 }, // width for 'amount'
  { wch: 15 }, // width for 'Remark'
];


  // Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

  // Write the workbook to binary array
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Convert to Blob and save
  const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(dataBlob, `${fileName}.xlsx`);
};
