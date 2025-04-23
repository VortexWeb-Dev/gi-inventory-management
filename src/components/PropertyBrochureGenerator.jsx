import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";

const PropertyBrochureGenerator = ({ listing }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check if device is mobile based on screen width
    useEffect(() => {
      const checkScreenSize = () => {
        setIsMobileView(window.innerWidth < 768); // Consider mobile if width is less than 768px
      };
      
      // Set initial value
      checkScreenSize();
      
      // Add event listener for window resize
      window.addEventListener('resize', checkScreenSize);
      
      // Clean up
      return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

  // Improved function to convert image to base64 with better error handling
  const getBase64FromUrl = async (url) => {
    try {
      // Add a cache-busting parameter to avoid CORS issues
      const imageUrl = new URL(url);
      imageUrl.searchParams.append("t", Date.now());

      const response = await axios.get(imageUrl.toString(), {
        responseType: "blob",
        // timeout: 10000, // 10 second timeout
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      const blob = response.data;

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (e) => {
          console.error("FileReader error:", e);
          reject(e);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error(`Error fetching image from ${url}:`, error);
      return null;
    }
  };

  const generatePDF = async () => {
    if (!listing) return;

    setLoading(true);
    setError(null);

    try {
      // Create PDF document with deep green theme
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Define colors
      const greenColor = [12, 55, 42]; // RGB for #0c372a
      const darkColor = [51, 51, 51]; // Dark gray
      const lightGray = [240, 240, 240]; // Light gray

      // Page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;

      // --- FIRST PAGE ---
      let yPos = margin;

      // Header with property reference and price
      doc.setFillColor(...greenColor);
      doc.rect(0, 0, pageWidth, 30, "F");

      doc.setTextColor(255, 255, 255); // White
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(`REF: ${listing.reference}`, margin, yPos + 10);

      // Price on right
      const priceText = `AED ${listing.price}`;
      const priceWidth =
        (doc.getStringUnitWidth(priceText) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      doc.text(priceText, pageWidth - margin - priceWidth, yPos + 10);

      // Main title centered
      yPos += 20;
      doc.setTextColor(...darkColor);
      doc.setFontSize(16);
      doc.text(listing.title, pageWidth / 2, yPos + 10, { align: "center" });

      yPos += 20;

      // ENSURE FIRST IMAGE IS ALWAYS ON FIRST PAGE WITH LARGE DIMENSIONS
      if (listing.images && listing.images.length > 0) {
        try {
          // Calculate maximum possible height for the image while ensuring other content fits
          const reservedSpace = 120; // Space for header, title, location, details, and footer
          const maxImageHeight = pageHeight - yPos - reservedSpace;
          const mainImageHeight = Math.min(contentWidth * 0.75, maxImageHeight); // Control aspect ratio

          // Show loading message during generation
          console.log("Loading main image...");

          // Try multiple times if needed
          let mainImageBase64 = null;
          let attempts = 0;

          while (!mainImageBase64 && attempts < 3) {
            mainImageBase64 = await getBase64FromUrl(listing.images[0].url);
            attempts++;
            if (!mainImageBase64) {
              console.log(`Attempt ${attempts} failed, retrying...`);
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
            }
          }

          if (mainImageBase64) {
            doc.addImage(
              mainImageBase64,
              "JPEG",
              margin,
              yPos,
              contentWidth, // Full width for the main image
              mainImageHeight // Calculated height
            );
            yPos += mainImageHeight + 10;
          } else {
            // Fallback if image fails to load
            doc.setFillColor(200, 200, 200);
            doc.rect(margin, yPos, contentWidth, contentWidth * 0.6, "F");
            doc.setTextColor(100, 100, 100);
            doc.text(
              "Image not available",
              pageWidth / 2,
              yPos + contentWidth * 0.3,
              { align: "center" }
            );
            yPos += contentWidth * 0.6 + 10;
          }
        } catch (e) {
          console.error("Error adding main image:", e);
          // Fallback rectangle
          doc.setFillColor(200, 200, 200);
          doc.rect(margin, yPos, contentWidth, contentWidth * 0.6, "F");
          doc.setTextColor(100, 100, 100);
          doc.text(
            "Image not available",
            pageWidth / 2,
            yPos + contentWidth * 0.3,
            { align: "center" }
          );
          yPos += contentWidth * 0.6 + 10;
        }
      }

      // Location
      doc.setFillColor(...lightGray);
      doc.rect(margin, yPos, contentWidth, 10, "F");
      doc.setFontSize(10);
      doc.setTextColor(...darkColor);
      doc.setFont("helvetica", "bold");
      doc.text("LOCATION", margin + 5, yPos + 7);

      yPos += 15;
      doc.setFont("helvetica", "normal");
      doc.text(
        listing.locationBayut || "Location information not available",
        margin,
        yPos
      );

      yPos += 10;

      // Property details in a horizontal layout
      const detailsWidth = contentWidth / 4;

      // Background for property details
      doc.setFillColor(...lightGray);
      doc.rect(margin, yPos, contentWidth, 25, "F");

      yPos += 8;

      // Bedrooms
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(
        String(listing.bedrooms || "N/A"),
        margin + detailsWidth * 0.2,
        yPos
      );
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("BEDROOMS", margin + detailsWidth * 0.2, yPos + 8);

      // Bathrooms
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(
        String(listing.bathrooms || "N/A"),
        margin + detailsWidth * 1.2,
        yPos
      );
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("BATHROOMS", margin + detailsWidth * 1.2, yPos + 8);

      // Unit Type
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(listing.unitType || "N/A", margin + detailsWidth * 2.2, yPos);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("TYPE", margin + detailsWidth * 2.2, yPos + 8);

      // Size
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(
        `${listing.size || "N/A"} sq.ft`,
        margin + detailsWidth * 3.2,
        yPos
      );
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("SIZE", margin + detailsWidth * 3.2, yPos + 8);

      // Footer with agent and company details for first page
      const footerY = pageHeight - 20;

      // Agent/Owner info
      doc.setTextColor(...darkColor);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(
        `Agent: ${listing.agentName || "N/A"}`,
        pageWidth - margin - 50,
        footerY
      );
      doc.setFont("helvetica", "normal");
      doc.text(
        `Owner: ${listing.ownerName || "N/A"}`,
        pageWidth - margin - 50,
        footerY + 5
      );

      // GI Properties logo/text
      doc.setTextColor(...greenColor);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("GI PROPERTIES", margin, footerY + 5);

      // --- SECOND PAGE FOR IMAGE GALLERY ---
      // Only add second page if there are additional images
      if (listing.images && listing.images.length > 1) {
        doc.addPage();
        yPos = margin;

        // Image gallery title
        doc.setFillColor(...greenColor);
        doc.rect(margin, yPos, contentWidth, 10, "F");
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("IMAGE GALLERY", margin + 5, yPos + 7);

        yPos += 15;

        // Set up grid for images - 2 columns
        const galleryImageWidth = (contentWidth - 10) / 2; // 10px gap between columns
        const galleryImageHeight = galleryImageWidth * 0.75; // 4:3 aspect ratio
        const imageGap = 10; // Gap between images

        // Load and place images in grid layout
        const imagesToProcess = listing.images.slice(
          1,
          Math.min(listing.images.length, 9)
        );
        const imagePromises = imagesToProcess.map((image) =>
          getBase64FromUrl(image.url)
        );

        // Process all images in parallel for better performance
        const imageResults = await Promise.allSettled(imagePromises);

        let imagesAdded = 0;
        let currentRow = 0;

        for (let i = 0; i < imageResults.length; i++) {
          const result = imageResults[i];
          const col = imagesAdded % 2;

          const imgX = margin + col * (galleryImageWidth + imageGap);
          const imgY = yPos + currentRow * (galleryImageHeight + imageGap);

          if (result.status === "fulfilled" && result.value) {
            try {
              doc.addImage(
                result.value,
                "JPEG",
                imgX,
                imgY,
                galleryImageWidth,
                galleryImageHeight
              );
            } catch (e) {
              console.error(`Error adding gallery image ${i + 1}:`, e);
              // Add placeholder for failed image
              doc.setFillColor(200, 200, 200);
              doc.rect(imgX, imgY, galleryImageWidth, galleryImageHeight, "F");
              doc.setTextColor(100, 100, 100);
              doc.text(
                "Image not available",
                imgX + galleryImageWidth / 2,
                imgY + galleryImageHeight / 2,
                { align: "center" }
              );
            }
          } else {
            // Add placeholder for failed image
            doc.setFillColor(200, 200, 200);
            doc.rect(imgX, imgY, galleryImageWidth, galleryImageHeight, "F");
            doc.setTextColor(100, 100, 100);
            doc.text(
              "Image not available",
              imgX + galleryImageWidth / 2,
              imgY + galleryImageHeight / 2,
              { align: "center" }
            );
          }

          imagesAdded++;
          if (col === 1) currentRow++; // Move to next row after 2 images

          // Start a new page if we've filled the current one (6 images per page)
          if (imagesAdded % 6 === 0 && i < imageResults.length - 1) {
            doc.addPage();
            yPos = margin;
            currentRow = 0;

            // Add header to new page
            doc.setFillColor(...greenColor);
            doc.rect(margin, yPos, contentWidth, 10, "F");
            doc.setFontSize(12);
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.text("IMAGE GALLERY (CONT.)", margin + 5, yPos + 7);

            yPos += 15;
          }
        }

        // Add footer to the gallery page as well
        const galleryFooterY = pageHeight - 20;

        // Agent/Owner info
        doc.setTextColor(...darkColor);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(
          `Agent: ${listing.agentName || "N/A"}`,
          pageWidth - margin - 50,
          galleryFooterY
        );
        doc.setFont("helvetica", "normal");
        doc.text(
          `Owner: ${listing.ownerName || "N/A"}`,
          pageWidth - margin - 50,
          galleryFooterY + 5
        );

        // GI Properties logo/text
        doc.setTextColor(...greenColor);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("GI PROPERTIES", margin, galleryFooterY + 5);
      }

      if (isMobileView) {
        <div className="bg-blue-600 text-white h-8 w-fit p-2">
          
        </div>
        // const pdfBlob = doc.output("blob");
        // const blobUrl = URL.createObjectURL(pdfBlob);
        
        // try {
        //   // Check if we're in Bitrix mobile environment
        //   if (typeof window.BXMobileApp !== 'undefined' && window.BXMobileApp.UI && window.BXMobileApp.UI.Document) {
        //     // Use Bitrix mobile document viewer
        //     window.BXMobileApp.UI.Document.open({
        //       url: blobUrl,
        //       title: `${listing.reference || "property"}-brochure.pdf`,
        //       type: 'pdf',
        //     });
        //     console.log("Opened PDF with BXMobileApp");
        //   } else if (typeof window.BX !== 'undefined' && window.BX.openExternalLink) {
        //     // Try older Bitrix method
        //     window.BX.openExternalLink(blobUrl);
        //     console.log("Opened PDF with BX.openExternalLink");
        //   } else {
        //     // General mobile fallback - create a temporary download link
        //     const link = document.createElement('a');
        //     link.href = blobUrl;
        //     link.download = `${listing.reference || "property"}-brochure.pdf`;
        //     document.body.appendChild(link);
        //     link.click();
        //     document.body.removeChild(link);
        //     console.log("Used fallback download method");
        //   }
        // } catch (err) {
        //   console.error("PDF download error:", err);
        //   // More user-friendly error message
        //   const errorMessage = `Unable to download PDF: ${err.message}`;
        //   alert(errorMessage);
          
        //   // Try one more fallback method
        //   try {
        //     window.open(blobUrl, '_blank');
        //   } catch (fallbackErr) {
        //     console.error("Fallback also failed:", fallbackErr);
        //   }
        // }
        
        // // Clean up the blob URL after some time
        // setTimeout(() => {
        //   URL.revokeObjectURL(blobUrl);
        // }, 60000); // 1 minute timeout
      } else {
        // For desktop: Use normal download method
        doc.save(`${listing.reference || "property"}-brochure.pdf`);
      }
      
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate brochure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isMobileView ? (
        <a
          href={`https://ec2-gicrm.ae/gi-inventory-pdf-handler/?id=${listing?.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm
            border border-[#0c372a] text-gray-600 hover:bg-green-100 cursor-pointer
            transition duration-150 font-medium
          `}
        >
          <Download size={16} />
          Brochure
        </a>
      ) : (
        <button
          onClick={generatePDF}
          disabled={loading || !listing}
          className={`
            flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm
            ${
              loading || !listing
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "border border-[#0c372a] text-gray-600 hover:bg-green-100 cursor-pointer"
            }
            transition duration-150 font-medium
          `}
        >
          <Download size={16} />
          {loading ? "Generating..." : "Brochure"}
        </button>
      )}
    </>
  );

}

export default PropertyBrochureGenerator;