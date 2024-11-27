// rootReducer.js
const initialState = {
  loading: false,
  cartItems: [],
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        // If item exists in cart, update its quantity
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      // If item doesn't exist, add it to the cart
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };
    }

    case 'UPDATE_CART': {
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item._id !== action.payload),
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        cartItems: [],
      };
    }

      default:
        return state;
    }
};
