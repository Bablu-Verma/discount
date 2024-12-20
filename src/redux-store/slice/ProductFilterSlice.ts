import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterData {
  categories: string[];
  price: string;
  order: string;
  trends: string[];
  amount: number[];
}

 
export const defaultFilterData: FilterData = {
  categories: [],
  price: "",
  order: "",
  trends: [],
  amount: [0, 10000000],
};


const PFilterSlice = createSlice({
  name: 'pfilter',
  initialState: defaultFilterData,
  reducers: {
    setFilterData: (state, action: PayloadAction<FilterData>) => {
      return action.payload;
    },
    resetFilters: () => {
      return defaultFilterData;
    }
  },
});


export const { setFilterData, resetFilters } = PFilterSlice.actions;


export default PFilterSlice.reducer;
