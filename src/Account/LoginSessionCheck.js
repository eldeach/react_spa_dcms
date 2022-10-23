//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== axios 라이브러리 import
import axios from 'axios';

async function LoginSessionCheck(typeStr,qryBody){
  let checkResult

  if(typeStr=="init")
  {
    checkResult = axios.post("/login",qryBody).then(function(res){
      if (res.data.success){
          const expires = new Date()
          expires.setMinutes(expires.getMinutes() + res.data.expireTime)
          cookies.save('loginStat',res.data.success,{path :'/',
            expires:expires,          // 유효 시간
            //secure: true,   // 웹 브라우저와 웹 서버가 https로 통신하는 경우에만 쿠키 저장
            // httpOnly: true  // document.cookie라는 자바스크립트 코드로 쿠키에 비정상적으로 접속하는 것을 막는 옵션
          })
          cookies.save('userInfo',res.data.userInfo,{path :'/',
            expires:expires,          // 유효 시간
            //secure: true,   // 웹 브라우저와 웹 서버가 https로 통신하는 경우에만 쿠키 저장
            // httpOnly: true  // document.cookie라는 자바스크립트 코드로 쿠키에 비정상적으로 접속하는 것을 막는 옵션
          })

          return {type:'init', expireTime: expires}
      }
      else {
        if(res.data.flashMsg.indexOf("wrong PW")!=(-1)){
          return {type:'init', expireTime: 0, flashMsg:res.data.flashMsg}
        }
        else if(res.data.flashMsg=="no user_account"){
          return {type:'init', expireTime: 0, flashMsg:res.data.flashMsg}
        }
        else if(res.data.flashMsg=="locked"){
          return {type:'init', expireTime: 0, flashMsg:res.data.flashMsg}
        }
        else if(res.data.flashMsg=="no auth"){
          return {type:'init', expireTime: 0, flashMsg:res.data.flashMsg}
        }
      }
    }).catch((err)=>{
      console.log(err)
      return {type:'check', expireTime: 0}
    })
  }
  else if(typeStr=="check")
  {
    checkResult = await axios.get("/logincheck").then(function(res){
      if (res.data.success){
          const expires = new Date()
          expires.setMinutes(expires.getMinutes() + res.data.expireTime)
          cookies.save('loginStat',res.data.success,{path :'/',
            expires:expires,          // 유효 시간
            //secure: true,   // 웹 브라우저와 웹 서버가 https로 통신하는 경우에만 쿠키 저장
            // httpOnly: true  // document.cookie라는 자바스크립트 코드로 쿠키에 비정상적으로 접속하는 것을 막는 옵션
          })
          cookies.save('userInfo',res.data.userInfo,{path :'/',
            expires:expires,          // 유효 시간
            //secure: true,   // 웹 브라우저와 웹 서버가 https로 통신하는 경우에만 쿠키 저장
            // httpOnly: true  // document.cookie라는 자바스크립트 코드로 쿠키에 비정상적으로 접속하는 것을 막는 옵션
          })
          return {type:'check', expireTime: expires}
      }
      else {
        axios.get("/logout").then((res)=>{}).catch((err)=>console.log(err))
        cookies.remove('loginStat', {path :'/',})
        cookies.remove('userInfo', {path :'/',})
        return {type:'check', expireTime: 0}
      }
    }).catch((err)=>{
      console.log(err)
      return {type:'check', expireTime: 0}
    })
  
  }

  return checkResult
}

export default LoginSessionCheck