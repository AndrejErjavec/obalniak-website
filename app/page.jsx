import Image from "next/image";

export default function Home() {
  return (
    <div className=" bg-cover bg-center w-full h-screen flex flex-col justify-center items-center bg-[url('/hero-bg.jpg')]">
      <h1 className="text-5xl">Obalni alpinistični klub</h1>
      <p className="text-xl my-5">Dobrodošli na naši strani!!</p>
    </div>
  );
}
