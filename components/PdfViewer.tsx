import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("./PdfViewerClient"), {
  ssr: false,
  loading: () => <div className="text-sm">Loading PDF viewer...</div>,
});

export default PdfViewer;
