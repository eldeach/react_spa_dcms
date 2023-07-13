//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useNavigate, useLocation } from 'react-router-dom';

import {PropTypes, Autocomplete, Switch, FormControlLabel, TextField, IconButton, Box, Typography, Chip, Button, Stack, Paper,Divider,Modal, ListItemIcon, ListItemText, ListItem, List } from '@mui/material/';


//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setSel_tb_user,setLoginExpireTime, setSel_doc_no, setSel_doc, setSelTmmsWholeAsset, setSelSapZmmr1010, setSelEqmsAtemplate, setSelTmmsLocation } from "./../store.js"

//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './../Account/LoginSessionCheck.js';

function Home(){
    let [isLogin,setIsLogin]=useState(false);
    useEffect(() => {
        // 이 페이지의 권한 유무 확인
        LoginCheck()
    },[]);

    async function LoginCheck(){
        let checkResult = await LoginSessionCheck("check",{})
        if(checkResult.expireTime==0){
          dispatch(setLoginExpireTime(0))
          setIsLogin(false)
        }
        else{
          dispatch(setLoginExpireTime(checkResult.expireTime))
          setIsLogin(true)
        }
      }
      //========================================================== [변수, 객체 선언][useNaviagte]
  let navigate = useNavigate()
    //========================================================== SlidePopup 작동 redux state 관련 선언
    let rdx = useSelector((state) => { return state } )
    let dispatch = useDispatch();

    return(
        <div style={{width:'70vw', marginTop:'30vh', marginLeft:'auto', marginRight:'auto', display:'block'}}>
            <Typography variant="h1" component="div" color="primary" >CDMS</Typography>
            <Typography variant="h5" component="div" sx={{marginLeft:'7px'}}>Centralized Document Management System</Typography>
            {!isLogin?<Button style={{marginLeft:'7px', marginTop:'2vh'}} size="large" variant="contained" onClick={async ()=>{navigate('/login')}}>User Login</Button>:<div/>}
        </div>
    )

}

export default Home