import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Order() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadedOrder, setLoadedOrder] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // 주문 데이터 불러오기
  useEffect(() => {
    fetchOrders();
  }, [id]);

  async function fetchOrders() {
    try {
      const response = await fetch(`http://localhost:3000/orders/${id}`);
      if (!response.ok) {
        throw new Error("주문을 불러오는데 실패했습니다.");
      }
      const order = await response.json();
      setLoadedOrder(order);
    } catch (error) {
      alert(error.message);
    }
  }

  // 주문 항목 삭제
  const handleDelete = async (itemId) => {
    try {
      const updatedItems = { ...loadedOrder.items };
      delete updatedItems[itemId];

      const response = await fetch(`http://localhost:3000/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: {
            ...loadedOrder,
            items: updatedItems,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("항목 삭제에 실패했습니다.");
      }

      fetchOrders(); // 주문 정보 다시 불러오기
      alert("항목이 삭제되었습니다.");
    } catch (error) {
      alert(error.message);
    }
  };

  // 수정 모드 토글
  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditItem({
      ...item,
      quantity: item.quantity,
    });
  };

  // 수량 변경
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setEditItem({
      ...editItem,
      quantity: value,
    });
  };

  // 수정 저장
  const handleSaveEdit = async () => {
    try {
      if (editItem.quantity <= 0) {
        throw new Error("수량은 1개 이상이어야 합니다.");
      }

      const updatedItems = {
        ...loadedOrder.items,
        [editItem.id]: {
          ...loadedOrder.items[editItem.id],
          quantity: editItem.quantity,
        },
      };

      const response = await fetch(`http://localhost:3000/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: {
            ...loadedOrder,
            items: updatedItems,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("수정에 실패했습니다.");
      }

      setIsEditing(false);
      setEditItem(null);
      fetchOrders(); // 주문 정보 다시 불러오기
      alert("수정이 완료되었습니다.");
    } catch (error) {
      alert(error.message);
    }
  };

  // 전체 주문 삭제
  const handleDeleteOrder = async () => {
    if (!window.confirm("정말 이 주문을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/orders/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("주문 삭제에 실패했습니다.");
      }

      alert("주문이 삭제되었습니다.");
      navigate("/orders"); // 주문 목록 페이지로 이동
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {loadedOrder?.customer} 님의 주문 내역
        </h2>
        <button
          onClick={handleDeleteOrder}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          주문 삭제
        </button>
      </div>

      {loadedOrder?.items !== undefined &&
        Object.keys(loadedOrder?.items).map((key) => {
          const item = loadedOrder.items[key];
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 border p-4 rounded mb-4 bg-white shadow"
            >
              <img
                src={`http://localhost:3000/${item.image}`}
                alt={item.name}
                style={{ width: "50px", height: "50px" }}
              />
              <span className="font-medium flex-1">{item.name}</span>

              {isEditing && editItem?.id === item.id ? (
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={editItem.quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    className="w-20 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditItem(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <span>{item.quantity}개</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => handleEditClick(item)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    수정
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default Order;
