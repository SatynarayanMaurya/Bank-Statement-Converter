import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    userDetails :null,
    loading :false,
    pdfData:null,
    bankName:null

}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setUserDetails :(state,action)=>{
            state.userDetails = action.payload
        },
        clearUserDetails : (state,action)=>{
            state.userDetails = null
        },
        setLoading :(state,action)=>{
            state.loading = action.payload;
        },
        setPdfData: (state, action) => {
            state.pdfData = action.payload;
        },
        clearPdfData: (state, action) => {
            state.pdfData = null;
        },
        setBankNames: (state, action) => {
            state.bankName = action.payload;
        },
        clearBankName: (state, action) => {
            state.bankName = null;
        },
    
    }
})

export const {setUserDetails,clearUserDetails, setLoading,setPdfData,clearPdfData,setBankNames,clearBankName} = userSlice.actions
export default userSlice.reducer