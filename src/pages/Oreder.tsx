import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Order() {
  const param = useParams();
  const [loadedOrder, setLoadedOrder] = useState({});
  useEffect(() => {
    async function fetchOrders() {
      const response = await fetch(`http://localhost:3000/orders/${param.id}`);
      if (!response.ok) {
        // 예외처리
      }
      const Order = await response.json();
      setLoadedOrder(Order);
    }
    fetchOrders();
  }, []);

  return (
    <>
      {console.log(loadedOrder)}
      <div>
        <h2>{loadedOrder?.customer} 님의 주문 내역</h2>
        {loadedOrder?.items !== undefined &&
          Object.keys(loadedOrder?.items).map((key) => (
            <div key={loadedOrder?.items[key].id} className="order-item">
              <img
                src={`http://localhost:3000/${loadedOrder?.items[key].image}`}
                alt={loadedOrder?.items[key].name}
                style={{ width: "50px", height: "50px" }}
              />
              <span> {loadedOrder?.items[key].name}</span>
              <span> {loadedOrder?.items[key].quantity}개</span>
              <button>삭제</button>
              <button>수정</button>
            </div>
          ))}
      </div>
    </>
  );
}

export default Order;
