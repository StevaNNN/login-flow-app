import { useEffect, useState } from "react";
import { getInfo } from "../api";

const InfoPage = () => {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await getInfo();
      setData(response.data.message);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4 text-emerald-300">
        Information Page
      </h1>
      <p className="mt-4 text-emerald-300">{data}</p>
    </div>
  );
};

export default InfoPage;
