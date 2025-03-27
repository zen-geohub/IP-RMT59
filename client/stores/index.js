import { configureStore } from '@reduxjs/toolkit';
import { geodataReducer } from './geodata.slice';
import { userFavoriteReducer } from './user_favorite.slice';

const store = configureStore({
  reducer: { geodataReducer, userFavoriteReducer },
});

export default store;