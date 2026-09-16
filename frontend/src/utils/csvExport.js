/**
 * Clean, RFC-4180 compliant CSV Export Utility for ShopSense
 */
export const downloadCSV = (filename, rows) => {
  try {
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      rows
        .map((row) =>
          row
            .map((cell) => {
              const str = cell === null || cell === undefined ? "" : String(cell);
              return `"${str.replace(/"/g, '""')}"`;
            })
            .join(",")
        )
        .join("\r\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error("CSV export error:", error);
    return false;
  }
};
