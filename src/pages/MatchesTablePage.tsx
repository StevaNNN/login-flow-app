import React from "react";
import { getMatches } from "../api";

const MatchesTablePage: React.FC = () => {
  const [matches, setMatches] = React.useState([]);

  React.useEffect(() => {
    const getMatchesInfo = async () => {
      const req = await getMatches();
      setMatches(req.data);
    };
    getMatchesInfo();
  }, []);

  console.log(matches);

  return (
    <div>
      <h1>Matches</h1>
    </div>
  );
};

export default MatchesTablePage;
