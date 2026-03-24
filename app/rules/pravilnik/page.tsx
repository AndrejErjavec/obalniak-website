"use client";

import PdfViewer from "@/components/PdfViewer";

function page() {
  return (
    <div className="px-5 mx-auto md:container">
      <h3 className="text-xl font-medium mb-3">Pravilnik o delovanju članov</h3>
      <PdfViewer file="/2021 pravilnik o delovanju članov čistopis.pdf" />
    </div>
  );
}

export default page;
