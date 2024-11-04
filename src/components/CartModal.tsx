import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearOrder, removeFromOrder } from "../redux/modules/counter";
import { useNavigate } from "react-router-dom";

const CartModal = ({ isOpen, onClose }) => {
  const { orders, totalQuantity } = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 이름 입력 상태 관리
  const [customerName, setCustomerName] = useState("");
  // 유효성 검증 오류 메시지 상태
  const [error, setError] = useState("");

  // 폼 제출 핸들러
  const onSubmitHandler = (event) => {
    event.preventDefault();

    // 이름 유효성 검증
    if (customerName.length < 2) {
      setError("이름을 2글자 이상 입력해주세요.");
      return;
    }

    // 주문 아이템이 없는 경우 검증
    if (Object.keys(orders).length === 0) {
      setError("장바구니가 비어있습니다.");
      return;
    }

    fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order: {
          items: orders,
          customer: customerName,
        },
      }),
    });

    dispatch(clearOrder());
    alert("주문이 완료되었습니다.");
    onClose();
    navigate("/orders");
  };

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setCustomerName("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 주문 버튼 활성화 여부 확인
  const isOrderButtonDisabled =
    customerName.length < 2 || Object.keys(orders).length === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">카트</h2>

        {error && alert("error")}

        <form onSubmit={onSubmitHandler}>
          <div className="mb-4">
            <label className="block mb-2">
              주문자:
              <input
                type="text"
                name="name"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  setError("");
                }}
                className="w-full border p-2 rounded"
                placeholder="이름을 입력하세요 (2글자 이상)"
              />
            </label>
          </div>

          <div className="mb-4">
            {Object.values(orders).map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-2"
              >
                <span>{item.name}</span>
                <span>{item.quantity}개</span>
                <button
                  type="button"
                  onClick={() => dispatch(removeFromOrder(item.id))}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <p className="font-bold">총 수량: {totalQuantity}개</p>
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              disabled={isOrderButtonDisabled}
              className={`px-4 py-2 rounded ${
                isOrderButtonDisabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              주문하기
            </button>

            <button
              type="button"
              onClick={() => dispatch(clearOrder())}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              비우기
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CartModal;
