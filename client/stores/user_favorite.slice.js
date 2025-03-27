import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list: null,
}

const userFavorite = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    fetchFavoritesData(state, action) {
      state['list'] = action.payload
    },
  },
})

export const { fetchFavoritesData } = userFavorite.actions
export const userFavoriteReducer = userFavorite.reducer