"use client"

import {useEffect, useState} from "react";
import {getAscents} from "@/app/lib/actions/ascent";
import {toast} from "react-toastify";
import AscentItem from "@/components/AscentItem";

export default function Ascents() {

  const [ascents, setAscents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAscents = async () => {
    setLoading(true);
    const result = await getAscents();
    if (result.error) {
      toast.error(result.error);
    }
    if (result.success) {
      setAscents(result.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAscents();
  }, []);

  if (loading) {
    return (
      <div className="flex w-full h-screen items-center justify-center text-xl">
        nalaganje
      </div>
    )
  }

  return (
    <div className="px-5 mx-auto md:container">
      <h1>Naši vzponi</h1>
      {ascents.length > 0 && (
        <div className="flex flex-col gap-3">
          {ascents.map((ascent) => (
            <AscentItem ascent={ascent} key={ascent.id} />
          ))}
        </div>
      )}
    </div>
  )
}