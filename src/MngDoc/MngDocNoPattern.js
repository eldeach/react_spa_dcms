//========================================================== React 라이브러리 import
import { useEffect,useState } from 'react';
import {  useNavigate } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import { Typography, Button, Paper } from '@mui/material/';
//---------------------------------------------------------- Material Icons
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setLoginExpireTime } from "../store.js"
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './../Account/LoginSessionCheck.js';
//========================================================== MngTable 컴포넌트 import
import MngTable from './../MngTable/MngTable'


function MngDocNoPattern(){
    let [tblCtrl,setTblCtrl]=useState(true)
    //========================================================== [변수, 객체 선언] 선택된 정보 redux 저장용
    let rdx = useSelector((state) => { return state } )
    let dispatch = useDispatch();
    //========================================================== useNaviagte 선언
    let navigate = useNavigate()
    //========================================================== useEffect 코드
    useEffect(() => {
        // 이 페이지의 권한 유무 확인
        authCheck()
    },[]);
  
    function authCheck(){
        if(cookies.load('loginStat')){
            if(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_INFO",0)!=-1){
                setTblCtrl(true)
            }
            else if(cookies.load('userInfo').user_auth.indexOf("VIEW_DOC_INFO",0)!=-1){
                setTblCtrl(false)
            }
            else{
                alert("MNG_DOC_INFO 또는 VIEW_DOC_INFO 권한이 없습니다.")
                navigate('/')
            }

        }
        else{
            alert("로그인 상태가 아닙니다.")
            navigate('/')
        }
    }

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
        <div style={{padding:'0.5vw'}}>
            <div>
                <MngTable getUrlStr={'/getmngdocnopattern'} targetPk={{}} heightValue={'75vh'} tblCtrl={tblCtrl} chkSel={true} deleteButton={true} addToListButton={false} editable={true} selectButton={false}/>
            </div>
            <div style={{height:'48px'}}/>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding:'10px' }} elevation={6}>
                <div style={{width:'100%', display:'flex', alignItems:'center', backdropFilter:'blur(10px)'}}>
                    <RuleFolderIcon color="primary"/>
                    <Typography variant="BUTTON" component="div" sx={{ flexGrow: 1, overflow:'hidden', marginLeft:'4px' }}>{"문서번호 패턴 관리"}</Typography>
                    {/* <Button size="small" disabled={!qrData||importDone} variant="contained" type="submit" form="putBinderCurrentLoc" >입고</Button> */}
                    <Button style={{marginLeft:'1vw'}} size="small" variant="contained" onClick={async ()=>{
                    LoginCheck()
                    navigate(-1)
                    }}>Cancel</Button>
                </div>
            </Paper>
        </div>

    )
}

export default MngDocNoPattern