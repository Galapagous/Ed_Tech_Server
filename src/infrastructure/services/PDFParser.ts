// import axios from "axios";
import { PDFParse } from "pdf-parse";

/**
 * Downloads a PDF from a URL and extracts its text content
 * @param url - Direct link to a PDF file
 * @returns Extracted text content of the PDF
 */
export const generatePDF = async (url: string): Promise<string> => {
  try {
    // console.log("📥 Attempting to fetch PDF from URL:", url);

    // const response = await axios.get(url, {
    //   responseType: "arraybuffer",
    //   timeout: 30000,
    //   maxRedirects: 5,
    // });

    // const buffer = Buffer.from(response.data);

    // console.log("✅ PDF file fetched. Length:", buffer.length, "bytes");

    // const pdfHeader = buffer.slice(0, 4).toString();
    // if (pdfHeader !== "%PDF") {
    //   console.warn(
    //     "⚠️ Warning: File may not be a valid PDF. First 100 bytes:\n",
    //     buffer.slice(0, 100).toString()
    //   );
    //   // Not throwing here — attempting to parse anyway
    // }

    // const pdfData = await new PDFParse(buffer);
    // console.log("📄 PDF parsed. Extracted text length:", pdfData.text.length);

    const parser = new PDFParse({ url });
    const pdfData = await parser.getText();
    return pdfData.text.trim();
  } catch (error: any) {
    console.error("❌ Error during PDF generation:");
    console.error({
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: url,
    });

    // More readable errors
    if (error.response?.status === 404) {
      throw new Error("PDF not found. Please check the URL.");
    } else if (error.response?.status === 403) {
      throw new Error("Access denied. PDF may be private.");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timed out while fetching PDF.");
    } else if (error.code === "ENOTFOUND") {
      throw new Error("Unable to reach the host. Check your network or URL.");
    }

    throw new Error(
      "An unexpected error occurred while fetching or parsing the PDF."
    );
  }
};
