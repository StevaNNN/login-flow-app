import React, { useState, useEffect } from "react";
import { useEffectAfterMount } from "../hooks/useEffectAfterMount";

const MatchesTablePage: React.FC = () => {
  const [state, setState] = useState(0);

  useEffectAfterMount(() => {
    console.log("I am running only after setState");
  }, [state]);

  return (
    <div>
      <button onClick={() => setState((prevState) => prevState + 1)}>
        click me
      </button>
    </div>
  );
};

export default MatchesTablePage;
