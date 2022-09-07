import { useEffect, useLayoutEffect, useState } from "react";
//========================================================== Material UI 라이브러리 import
import { Chip } from '@mui/material/';
//========================================================== axios 라이브러리 import
import axios from 'axios';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setLoginExpireTime } from "./../store.js"
import { useNavigate } from "react-router-dom";
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './LoginSessionCheck.js';


function LoginTimer(){
  //========================================================== [변수, 객체 선언] 선택된 정보 redux 저장용
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();

  //========================================================== [변수, 객체 선언] useNavigate
  let navigate = useNavigate();
  //========================================================== [변수, 객체 선언] 선택된 정보 redux 저장용
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  useEffect(() => {
    const countdown = setInterval(() => {
      if(rdx.loginExpireTime!=0){
        let nowDateTime = new Date();
        let diffDateTime = new Date(rdx.loginExpireTime).getTime()-nowDateTime.getTime()
        if(diffDateTime>=0){
          let diffMin = diffDateTime/(1000*60)
          let tempMin = Math.floor(diffMin)
          let tempSec = Math.round((diffMin-tempMin)*60)
          if (tempMin<10) setMinutes('0'+tempMin)
          else setMinutes(''+tempMin)
          
          if (tempSec<10) setSeconds('0'+tempSec)
          else setSeconds(''+tempSec)
        }
        else{
          axios.get("/logout").then((res)=>{}).catch((err)=>console.log(err))
          cookies.remove('loginStat', {path :'/',})
          cookies.remove('userInfo', {path :'/',})
          dispatch(setLoginExpireTime(0))
          navigate("/userlogin")
        }
      }
    }, 1000);
    return () => clearInterval(countdown);
  },[][minutes, seconds]);

  useLayoutEffect(()=>{
    LoginCheck()
  },[])


  async function LoginCheck(){
    let checkResult = await LoginSessionCheck("check",{})
    if(checkResult.expireTime==0){
      dispatch(setLoginExpireTime(0))
      navigate('/login')
    }
    else{
      dispatch(setLoginExpireTime(checkResult.expireTime))
    }
  }

  return(
      <Chip label={"Login Expire in "+minutes+":"+seconds} size="small" color="loginTimer" variant="outlined"/>
  )
}

export default LoginTimer