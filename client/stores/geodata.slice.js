import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null,
  recommendation: null,
  category: null
}

const geodataSlice = createSlice({
  name: 'geodata',
  initialState,
  reducers: {
    fetchGeodata(state, action) {
      state['data'] = action.payload
    },
    fetchRecommendation(state, action) {
      state['recommendation'] = action.payload
    },
    fetchCategory(state, action) {
      state['category'] = action.payload
    }
  },
})

export const { fetchGeodata, fetchRecommendation, fetchCategory } = geodataSlice.actions
export const geodataReducer = geodataSlice.reducer