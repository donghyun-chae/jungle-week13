import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const StTodos = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

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

const Orders = () => {
  const [loadedOrders, setLoadedOrders] = useState([]);
  useEffect(() => {
    async function fetchOrders() {
      const response = await fetch("http://localhost:3000/orders");
      if (!response.ok) {
        // 예외처리
        return <div>no post</div>;
      }
      const Orders = await response.json();
      setLoadedOrders(Orders);
    }
    fetchOrders();
  }, []);

  const onClickHandler = (id) => {
    async function deleteOrder(id) {
      console.log(id);
      const response = await fetch(`http://localhost:3000/orders/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setLoadedOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== id)
        );
      }
    }
    deleteOrder(id);
  };

  return (
    <>
      <StTodos>
        {loadedOrders.map((order) => (
          <StTodo key={order.id}>
            {order.customer}님의 주문
            {order?.items !== undefined &&
              Object.keys(order?.items).map((k) => (
                <div key={order?.items[k].id} className="order-item">
                  <img
                    src={`http://localhost:3000/${order?.items[k].image}`}
                    alt={order?.items[k].name}
                    style={{ width: "50px", height: "50px" }}
                  />
                  <span> {order?.items[k].name}</span>
                  <span> {order?.items[k].quantity}개</span>
                </div>
              ))}
            <button onClick={() => onClickHandler(order.id)}>삭제하기</button>
            <Link to={`/orders/${order.id}`}>
              <span style={{ cursor: "pointer" }}>수정하기 {order.todo}</span>
            </Link>
          </StTodo>
        ))}
      </StTodos>
    </>
  );
};

export default Orders;
