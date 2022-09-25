import { configureStore, createSlice } from '@reduxjs/toolkit' // redux 기본 라이브러리

let sel_tb_user = createSlice({
  name : 'tb_user_sel',
  initialState : {},
  reducers:{
    setSel_tb_user(state,targetRow){
      return state = targetRow.payload
    }
  }
})

let sel_doc_pattern = createSlice({
  name : 'sel_doc_pattern',
  initialState : [],
  reducers:{
    setSel_doc_pattern(state,targetRow){
      return state = targetRow.payload
    }
  }
})

let sel_doc_pattern_cols = createSlice({
  name : 'sel_doc_pattern',
  initialState : [],
  reducers:{
    setSel_doc_pattern_cols(state,targetRow){
      return state = targetRow.payload
    }
  }
})

let sel_doc_no = createSlice({
  name : 'sel_doc_no',
  initialState : {},
  reducers:{
    setSel_doc_no(state,targetRow){
      return state = targetRow.payload
    }
  }
})

let loginExpireTime = createSlice({
  name : 'loginExpireTime',
  initialState : 0,
  reducers:{
    setLoginExpireTime(state,newTime){
      return state = newTime.payload
    }
  }
})

let selTmmsWholeAsset = createSlice({
  name : 'selTmmsWholeAsset',
  initialState : [],
  reducers:{
    setSelTmmsWholeAsset(state,newTime){
      return state = newTime.payload
    }
  }
})

let selSapZmmr1010 = createSlice({
  name : 'selSapZmmr1010',
  initialState : [],
  reducers:{
    setSelSapZmmr1010(state,newTime){
      return state = newTime.payload
    }
  }
})

let selEqmsAtemplate = createSlice({
  name : 'selEqmsAtemplate',
  initialState : [],
  reducers:{
    setSelEqmsAtemplate(state,newTime){
      return state = newTime.payload
    }
  }
})

export let {setSel_tb_user}=sel_tb_user.actions
export let {setLoginExpireTime}=loginExpireTime.actions
export let {setSel_doc_pattern}=sel_doc_pattern.actions
export let {setSel_doc_pattern_cols}=sel_doc_pattern_cols.actions
export let {setSel_doc_no}=sel_doc_no.actions
export let {setSelTmmsWholeAsset} = selTmmsWholeAsset.actions
export let {setSelSapZmmr1010} = selSapZmmr1010.actions
export let {setSelEqmsAtemplate} = selEqmsAtemplate.actions

export default configureStore({
  reducer: {
    sel_tb_user:sel_tb_user.reducer,
    loginExpireTime:loginExpireTime.reducer,
    sel_doc_pattern:sel_doc_pattern.reducer,
    sel_doc_pattern_cols:sel_doc_pattern_cols.reducer,
    sel_doc_no:sel_doc_no.reducer,
    selTmmsWholeAsset:selTmmsWholeAsset.reducer,
    selSapZmmr1010:selSapZmmr1010.reducer,
    selEqmsAtemplate:selEqmsAtemplate.reducer
  }
}) 