"use client";

import PdfViewer from "@/components/PdfViewer";

function page() {
  return (
    <div className="px-5 mx-auto md:container">
      <h3 className="text-xl font-medium mb-3 mt-12">Statut Obalnega alpinističnega kluba</h3>
      <PdfViewer file="/ČISTOPIS statut OBALNI AK 18012014.pdf" />
    </div>
  );
}

export default page;
