//========================================================== React 라이브러리 import
import { useEffect,useState } from 'react';
import {  useNavigate } from 'react-router-dom';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'

import MngTable from './../MngTable/MngTable'


function MngAccount(){
    let [tblCtrl,setTblCtrl]=useState(true)

//========================================================== useNaviagte 선언
let navigate = useNavigate()
//========================================================== useEffect 코드
useEffect(() => {
    // 이 페이지의 권한 유무 확인
    authCheck()
},[]);
  
    function authCheck(){
        if(cookies.load('loginStat')){
            if(cookies.load('userInfo').user_auth.indexOf("MNG_ACCOUNT",0)!=-1){
                setTblCtrl(true)
            }
            else if(cookies.load('userInfo').user_auth.indexOf("VIEW_MNG_ACCOUNT",0)!=-1){
                setTblCtrl(false)
            }
            else{
                alert("MNG_ACCOUNT 또는 VIEW_MNG_ACCOUNT 권한이 없습니다.")
                navigate('/')
            }

        }
        else{
            alert("로그인 상태가 아닙니다.")
            navigate('/')
        }
    }

    return(
        <div>
            <MngTable getUrlStr={'/getmngaccount'} targetPk={{}} heightValue={'76vh'} tblCtrl={tblCtrl} chkSel={true} deleteButton={true} addToListButton={false} editable={true} selectButton={false}/>
        </div>

    )
}

export default MngAccount