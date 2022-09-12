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

let loginExpireTime = createSlice({
  name : 'loginExpireTime',
  initialState : 0,
  reducers:{
    setLoginExpireTime(state,newTime){
      return state = newTime.payload
    }
  }
})

export let {setSel_tb_user}=sel_tb_user.actions
export let {setLoginExpireTime}=loginExpireTime.actions
export let {setSel_doc_pattern}=sel_doc_pattern.actions
export let {setSel_doc_pattern_cols}=sel_doc_pattern_cols.actions



export default configureStore({
  reducer: {
    sel_tb_user:sel_tb_user.reducer,
    loginExpireTime:loginExpireTime.reducer,
    sel_doc_pattern:sel_doc_pattern.reducer,
    sel_doc_pattern_cols:sel_doc_pattern_cols.reducer
  }
}) 