import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToCSVKotak = (data, fileName = 'transactions') => {
  if (!data || data.length === 0) {
    console.error("No data to export");
    return;
  }

  const formattedData = data.map(item => ({
    ...item,
    date: typeof item.date === 'string' ? item.date : new Date(item.date).toISOString().split('T')[0]
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const csv = '\uFEFF' + XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  // ✅ Force .csv filename
  const finalFileName = fileName.toLowerCase().endsWith('.csv') ? fileName : `${fileName}.csv`;

  saveAs(blob, finalFileName);
};
