// src/modules/counter.ts
const ADD_TO_ORDER = "ADD_TO_ORDER";
const REMOVE_FROM_ORDER = "REMOVE_FROM_ORDER";
const CLEAR_ORDER = "CLEAR_ORDER";

export const addToOrder = (snackItem, quantity) => {
  return {
    type: ADD_TO_ORDER,
    payload: {
      id: snackItem.id,
      name: snackItem.name,
      image: snackItem.image,
      quantity,
    },
  };
};

export const removeFromOrder = (snackId) => {
  return {
    type: REMOVE_FROM_ORDER,
    payload: snackId,
  };
};

export const clearOrder = () => {
  return {
    type: CLEAR_ORDER,
  };
};

// 초기 상태값
const initialState = {
  orders: {}, // { snackId: { id, name, image, quantity } }
  totalQuantity: 0,
};

const counter = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_ORDER: {
      const { id, name, image, quantity } = action.payload;
      const existingOrder = state.orders[id];

      const updatedOrders = {
        ...state.orders,
        [id]: {
          id,
          name,
          image,
          quantity: existingOrder
            ? existingOrder.quantity + quantity
            : quantity,
        },
      };

      // 총 수량
      const totalQuantity = Object.values(updatedOrders).reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        orders: updatedOrders,
        totalQuantity,
      };
    }

    case REMOVE_FROM_ORDER: {
      const updatedOrders = { ...state.orders };
      delete updatedOrders[action.payload];

      // 총 수량 재계산
      const totalQuantity = Object.values(updatedOrders).reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        orders: updatedOrders,
        totalQuantity,
      };
    }

    case CLEAR_ORDER:
      return initialState;

    default:
      return state;
  }
};

export default counter;
