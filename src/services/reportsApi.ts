import { environment } from "../environments/environments";
export interface IReportModel {
  id: string;
  date: string;
  type: string;
  publisher: string;
  title?: string;
  description?: string;
  pdfData?: string; // Base64 encoded PDF data
}
export  interface Publisher {
  userId: string;
  email: string;
  displayName: string;
}
export interface Status{

delivered: string;
error: string;
failed: boolean;
method: string;
recipient: string;
sent:string;
}

export  interface Report {
  reportId: string;
  year: number;
  publisher: Publisher;
  published: string;
  format: string;
  status: Status[];
}


// const API_KEY = 'pst_bs6xevRYWdtan2KzhKpAPupiY2KLnAD7';

const yearRoutes = environment.api.year;
const reportRoutes = environment.api.reports;
export const reportsApi = {

  // GET /reports/years
  async getAvailableYears(): Promise<number[]> {
  
  try {
    const response = await fetch(yearRoutes.getAll);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { years: number[] } = await response.json();
    console.log(data.years); 
    return data.years;
  } catch (err) {
    console.error("Error fetching report years:", err);
    return []; 
  }
  },

  // GET /reports/list
  async getReportsForYear(year: number): Promise<Report[]> {
   
    try {
      const response = await fetch(`${reportRoutes.getReportsForYear}${year}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: { reports: Report[] } = await response.json();
      console.log(data.reports);
      return data.reports;
    } catch (err) {
      console.error("Error fetching reports:", err);
      return [];
    }
  },


}


// Utility function to download PDF
export async function downloadReportPDF( reportId: string) {
  try {
    const response = await fetch(
      `${reportRoutes.getReport}${reportId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  
    const report = data.report;

    if (!report.formattedPdf) {
      console.error("No PDF data found in report");
      return;
    }

    // Decode base64 -> binary
    const byteCharacters = atob(report.formattedPdf);
//report.formattedPdf is a Base64-encoded string of a PDF file.
// atob() decodes the Base64 string into a binary string, 
// where each character represents a byte of the file.
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    // byteCharacters.charCodeAt(i) converts each character of the binary
    //  string into its numeric byte value (0–255).

    // byteNumbers becomes an array of numbers representing the PDF’s raw bytes.
    // Create blob and download
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    // Uint8Array is a typed array of 8-bit unsigned integers.

    // Browsers need typed arrays to create a Blob from raw binary data.
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.meta.reportId}.pdf`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    return ;
  } catch (err) {
    console.error("Error fetching report by ID:", err);
    return null;
  }

   
  
}
