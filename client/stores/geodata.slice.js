import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null,
}

const geodataSlice = createSlice({
  name: 'geodata',
  initialState,
  reducers: {
    fetchGeodata(state, action) {
      state['data'] = action.payload
    },
  },
})

export const { fetchGeodata } = geodataSlice.actions
export const geodataReducer = geodataSlice.reducer