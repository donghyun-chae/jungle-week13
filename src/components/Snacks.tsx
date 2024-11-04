import { useEffect, useState } from "react";
import Snack from "./Snack";
import styled from "styled-components";

const StTodos = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Snacks = () => {
  const [loadedSnacks, setLoadedSnacks] = useState([]);
  useEffect(() => {
    async function fetchSnacks() {
      const response = await fetch("http://localhost:3000/meals");
      if (!response.ok) {
        // 예외처리
      }
      const snacks = await response.json();
      setLoadedSnacks(snacks);
    }
    fetchSnacks();
  }, []);

  return (
    <>
      <StTodos>
        {loadedSnacks.map((snack) => (
          <Snack key={snack.id}>{snack}</Snack>
        ))}
      </StTodos>
    </>
  );
};

export default Snacks;
