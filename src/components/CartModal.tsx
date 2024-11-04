import { useSelector, useDispatch } from "react-redux";
import { clearOrder, removeFromOrder } from "../redux/modules/counter";

const CartModal = ({ isOpen, onClose }) => {
  const { orders, totalQuantity } = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  const onSubmitHandler = (event) => {
    event.preventDefault();
    const fd = new FormData(event.target);
    console.log(orders.length);
    fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order: {
          items: orders,
          customer: fd.get("name"),
        },
      }),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>카트</h2>
        <form onSubmit={onSubmitHandler}>
          주문자:
          <input
            type="text"
            name="name"
            required
            placeholder="이름을 입력하세요"
          />
          {Object.values(orders).map((item) => (
            <div key={item.id} className="order-item">
              <img
                src={`http://localhost:3000/${item.image}`}
                alt={item.name}
                style={{ width: "50px", height: "50px" }}
              />
              <span>{item.name}</span>
              <span>{item.quantity}개</span>
              <span>
                <button
                  onClick={() => {
                    dispatch(removeFromOrder(item.id));
                  }}
                >
                  삭제
                </button>
              </span>
            </div>
          ))}
          <div className="order-summary">
            <p>총 수량: {totalQuantity}개</p>
          </div>
          <button type="submit">주문하기</button>
        </form>
        <div>
          <button
            onClick={() => {
              dispatch(clearOrder());
            }}
          >
            비우기
          </button>
        </div>

        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default CartModal;
