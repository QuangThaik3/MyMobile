import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    carts: {},
  },
  reducers: {
    addProduct: (state, action) => {
      const { userId, productToAdd } = action.payload;

      if (!state.carts[userId]) {
        state.carts[userId] = {
          products: [],
          quantity: 0,
          total: 0,
        };
      }

      const existingProductIndex = state.carts[userId].products.findIndex(
        (product) => product.id === productToAdd.id && product.color === productToAdd.color
      );

      if (existingProductIndex !== -1) {
        state.carts[userId].products[existingProductIndex].quantity += 1;
      } else {
        state.carts[userId].products.push({
          ...productToAdd,
          quantity: 1,
        });
      }

      state.carts[userId].quantity += 1;
      state.carts[userId].total += productToAdd.price;
    },
    updateQuantity: (state, action) => {
      const { userId, productId, newQuantity } = action.payload;

      if (userId && state.carts[userId]) {
        const productIndex = state.carts[userId].products.findIndex(
          (product) =>
            product.id === productId && product.color === action.payload.productColor
        );

        if (productIndex !== -1) {
          const product = state.carts[userId].products[productIndex];
          const updatedQuantity = Math.max(0, product.quantity + newQuantity);

          // Use Immer correctly to update the state
          state.carts[userId].products[productIndex].quantity = updatedQuantity;

          if (updatedQuantity === 0) {
            // If the quantity becomes 0, remove the product
            state.carts[userId].products.splice(productIndex, 1);
          }

          // Update total and overall quantity
          state.carts[userId].total = state.carts[userId].products.reduce(
            (total, p) => total + p.price * p.quantity,
            0
          );
          state.carts[userId].quantity = state.carts[userId].products.reduce(
            (total, p) => total + p.quantity,
            0
          );
        }
      }  else if (!userId && state.carts.undefined) {
        const productIndex = state.carts.undefined.products.findIndex(
          (product) =>
            product.id === productId && product.color === action.payload.productColor
        );
    
        if (productIndex !== -1) {
          const product = state.carts.undefined.products[productIndex];
          const updatedQuantity = Math.max(0, product.quantity + newQuantity);
    
          // Sử dụng Immer đúng cách để cập nhật trạng thái
          state.carts.undefined.products[productIndex].quantity = updatedQuantity;
    
          if (updatedQuantity === 0) {
            // Nếu số lượng trở thành 0, loại bỏ sản phẩm
            state.carts.undefined.products.splice(productIndex, 1);
          }
    
          // Cập nhật tổng và tổng số lượng chung
          state.carts.undefined.total = state.carts.undefined.products.reduce(
            (total, p) => total + p.price * p.quantity,
            0
          );
          state.carts.undefined.quantity = state.carts.undefined.products.reduce(
            (total, p) => total + p.quantity,
            0
          );
        }
      }
    },
    removeProduct: (state, action) => {
      const { userId, productId } = action.payload;

      if (userId && state.carts[userId]) {
        const productIndex = state.carts[userId].products.findIndex(
          (product) => product.id === productId
        );

        if (productIndex !== -1) {
          state.carts[userId].products.splice(productIndex, 1);

          // Update total
          state.carts[userId].total = state.carts[userId].products.reduce(
            (total, product) => total + product.price * product.quantity,
            0
          );

          // Update overall quantity
          state.carts[userId].quantity = state.carts[userId].products.reduce(
            (total, product) => total + product.quantity,
            0
          );
        }
      } else if (!userId && state.carts.undefined) {
        const productIndex = state.carts.undefined.products.findIndex(
          (product) => product.id === productId
        );
    
        if (productIndex !== -1) {
          // Loại bỏ sản phẩm khỏi mảng
          state.carts.undefined.products.splice(productIndex, 1);
    
          // Cập nhật tổng
          state.carts.undefined.total = state.carts.undefined.products.reduce(
            (total, product) => total + product.price * product.quantity,
            0
          );
    
          // Cập nhật tổng số lượng chung
          state.carts.undefined.quantity = state.carts.undefined.products.reduce(
            (total, product) => total + product.quantity,
            0
          );
        }
      }
    },
    updateCart: (state, action) => {
      const { userId, updatedCartProducts } = action.payload;

      if (userId && state.carts[userId]) {
        state.carts[userId].products = updatedCartProducts;
      } else if (!userId && state.carts.undefined) {
        state.carts.undefined.products = updatedCartProducts;
      }

      // Cập nhật tổng và tổng số lượng chung sau khi cập nhật giỏ hàng
      state.carts[userId ? userId : "undefined"].total = updatedCartProducts.reduce(
        (total, p) => total + p.price * p.quantity,
        0
      );
      state.carts[userId ? userId : "undefined"].quantity = updatedCartProducts.reduce(
        (total, p) => total + p.quantity,
        0
      );
    },    
    removeCart: (state, action) => {
      const { userId } = action.payload;

      if(userId && state.carts[userId]) {
        delete state.carts[userId];
      } else if (!userId && state.carts.undefined) {
        delete state.carts.undefined;
      }
    },
  },
});

export const { addProduct, removeProduct, updateQuantity, removeCart, updateCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCart = (state) => state.cart;
