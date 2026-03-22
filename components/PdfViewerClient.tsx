"use client";

import { useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FiChevronLeft, FiChevronRight, FiMinus, FiPlus } from "react-icons/fi";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

type PdfViewerProps = {
  file: string;
};

export default function PdfViewerClient({ file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.1);
  const [currentPageInput, setCurrentPageInput] = useState("1");

  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setCurrentPageInput("1");
    pageRefs.current = Array(numPages).fill(null);
  }

  function goToPage(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > numPages) return;

    pageRefs.current[pageNumber - 1]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setCurrentPageInput(String(pageNumber));
  }

  function handlePageSubmit() {
    const page = Number(currentPageInput);
    if (!Number.isNaN(page)) {
      goToPage(page);
    }
  }

  const pages = useMemo(() => {
    return Array.from({ length: numPages }, (_, index) => index + 1);
  }, [numPages]);

  return (
    <div className="flex h-screen flex-col overflow-hidden rounded-xl border bg-neutral-100">
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl border-b bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
            className="rounded-md bg-slate-700 px-2 py-2 text-sm text-white"
          >
            <FiMinus />
          </button>

          <span className="text-center text-sm">{Math.round(scale * 100)}%</span>

          <button
            type="button"
            onClick={() => setScale((prev) => Math.min(3, prev + 0.1))}
            className="rounded-md bg-slate-700 px-2 py-2 text-sm text-white"
          >
            <FiPlus />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="pageNumber"
            name="pageNumber"
            type="number"
            min={1}
            max={numPages || 1}
            value={currentPageInput}
            onChange={(e) => setCurrentPageInput(e.target.value)}
            onBlur={handlePageSubmit}
            className="rounded-md border text-center text-sm text-neutral-600"
          />
          <span className="text-sm text-neutral-600">/ {numPages || 0}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(Math.max(1, Number(currentPageInput) - 1))}
            className="rounded-md bg-slate-700 px-3 py-1.5 text-sm text-white"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => goToPage(Math.min(numPages, Number(currentPageInput) + 1))}
            className="rounded-md bg-slate-700 px-3 py-1.5 text-sm text-white"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onError={(error) => console.log(error)}
          loading={<div className="text-sm">Loading PDF...</div>}
          error={<div className="text-sm text-red-600">Failed to load PDF.</div>}
        >
          <div className="mx-auto flex max-w-fit flex-col gap-6">
            {pages.map((pageNumber) => (
              <div
                key={pageNumber}
                ref={(el) => {
                  pageRefs.current[pageNumber - 1] = el;
                }}
                className="rounded-lg bg-white p-3 shadow"
              >
                <Page pageNumber={pageNumber} scale={scale} renderTextLayer renderAnnotationLayer />
              </div>
            ))}
          </div>
        </Document>
      </div>
    </div>
  );
}
