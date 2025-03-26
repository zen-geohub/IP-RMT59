import { configureStore } from '@reduxjs/toolkit';
import { geodataReducer } from './geodata.slice';

const store = configureStore({
  reducer: { geodataReducer },
});

export default store;