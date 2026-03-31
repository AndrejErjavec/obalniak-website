import dynamic from "next/dynamic";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const PdfViewer = dynamic(() => import("./PdfViewerClient"), {
  ssr: false,
  loading: () => <div className="text-sm">Loading PDF viewer...</div>,
});

export default PdfViewer;
