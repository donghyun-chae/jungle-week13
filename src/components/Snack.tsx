import { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { addToOrder } from "../redux/modules/counter";

const StTodo = styled.div`
  border: 1px solid #ddd;
  width: 300px;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ProductName = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
`;

const CountDisplay = styled.h2`
  margin: 0;
  min-width: 40px;
  text-align: center;
`;

const Snack = (props) => {
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  const handleDecrement = () => {
    if (count > 0) {
      setCount(count - 1);
    } else {
      alert("0보다 낮아질 수 없습니다.");
    }
  };

  const handleAddToCart = () => {
    if (count > 0) {
      dispatch(addToOrder(props.children, count));
      setCount(0);
    }
  };

  return (
    <StTodo>
      <ProductInfo>
        <ProductName>{props.children.name}</ProductName>
        <ProductImage
          src={`http://localhost:3000/${props.children.image}`}
          alt={props.children.name}
        />
      </ProductInfo>

      <CounterContainer>
        <button className="counter" onClick={() => setCount(count + 1)}>
          +
        </button>
        <CountDisplay>{count}</CountDisplay>
        <button className="counter" onClick={handleDecrement}>
          -
        </button>
      </CounterContainer>

      <button className="add-cart" onClick={handleAddToCart}>
        담기
      </button>
    </StTodo>
  );
};

export default Snack;
