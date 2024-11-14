import Header from "@/components/Header";

export default function Home() {
  return (
    <div className=" bg-cover bg-center w-full h-screen flex flex-col justify-center items-center bg-[url('/hero-bg.jpg')]">
      <div className=""></div>

      <h1 className="text-6xl text-white font-semibold">
        Obalni alpinistični klub
      </h1>
      <p className="text-2xl my-5 text-white">Dobrodošli na naši strani!</p>
    </div>
  );
}
