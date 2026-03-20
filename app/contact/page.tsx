import { FiMail, FiUser } from "react-icons/fi";

export default function ContactPage() {
  return (
    <div className="px-5 mx-auto md:container">
      <h1 className="text-3xl font-semibold my-8">Kontakt</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-5">
        <div className="flex flex-col border border-gray-200 p-5 rounded-lg shadow-sm">
          <div className="flex gap-3 items-center mb-3">
            <div className="rounded-full p-3 bg-blue-800 text-white">
              <FiMail />
            </div>
            <h3 className="font-medium text-2xl text-slate-800">Naslov</h3>
          </div>
          <div className="text-base leading-6 mt-3 font-medium text-slate-700">
            <p>OBALNI ALPINISTIČNI KLUB</p>
            <p>Zg. Škofije 14</p>
            <p>6281 Škofije</p>
          </div>
        </div>

        <div className="flex flex-col items-start justify-start border border-gray-200 p-5 rounded-lg shadow-sm">
          <div className="flex gap-3 items-center mb-3">
            <div className="rounded-full p-3 bg-blue-800 text-white">
              <FiUser />
            </div>
            <h3 className="font-medium text-2xl leading-10 text-slate-800">Upravni odbor</h3>
          </div>
          <div className="flex flex-col gap-1 text-slate-700 leading-6 mt-3">
            <p>
              <span className="font-medium">Miha Živec</span> – načelnik
            </p>
            <p>
              <span className="font-medium">Martin Adamič</span> – namestnik načelnika
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start justify-start border border-gray-200 p-5 rounded-lg shadow-sm">
          <div className="flex gap-3 items-center mb-3">
            <div className="rounded-full p-3 bg-blue-800 text-white">
              <FiMail />
            </div>
            <h3 className="font-medium text-2xl leading-10 text-slate-800">Email</h3>
          </div>
          <div className="flex flex-col gap-1 text-slate-700 leading-6 mt-3 font-medium">
            <p>info@obalniak.si</p>
          </div>
        </div>
      </div>
    </div>
  );
}
