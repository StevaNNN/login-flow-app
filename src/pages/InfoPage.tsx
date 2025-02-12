import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInfo } from "../api";

const InfoPage = () => {
  const [data, setData] = useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const response = await getInfo();
      setData(response.data.message);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Information Page</h1>
      <p className="mt-4">{data}</p>
      <button
        className="mt-4 bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        onClick={() => navigate("/users")}
      >
        Go back
      </button>
    </div>
  );
};

export default InfoPage;
