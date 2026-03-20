"use client";

import PdfViewer from "@/components/PdfViewer";

export default function Rules() {
  return (
    <div className="px-5 mx-auto md:container">
      <h1 className="text-3xl font-semibold my-8">Pravila</h1>
      <h3 className="text-xl font-medium mb-3">Pravilnik o delovanju članov</h3>
      <PdfViewer file="/2021 pravilnik o delovanju članov čistopis.pdf" />
      <h3 className="text-xl font-medium mb-3 mt-12">Status Obalnega alpinističnega kluba</h3>
      <PdfViewer file="/ČISTOPIS statut OBALNI AK 18012014.pdf" />
    </div>
  );
}
