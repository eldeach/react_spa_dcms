//========================================================== React 라이브러리 import
import { useEffect,useRef,useState } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== QRCode 라이브러리 import
import { QRCode } from 'react-qrcode-logo';

import {PropTypes, Box,Autocomplete, TextField,Button,Paper, Typography, Stack, Chip } from '@mui/material/';
import PrintIcon from '@mui/icons-material/Print';
import ReactToPrint from 'react-to-print';

import DescriptionIcon from '@mui/icons-material/Description';
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setLoginExpireTime } from "./../store.js"

//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './../Account/LoginSessionCheck.js';
//========================================================== Formik & Yup 라이브러리 import
import { Formik } from 'formik';
import * as yup from 'yup';



function PrintBinder(){
          //========================================================== Formik & yup Validation schema
  const schema = yup.object().shape({

    // binder_year: yup.number()
    // .test(
    //     'length',
    //     "연도는 4자리 숫자로 입력해야 합니다.",
    //     function(value){
    //         if(typeof(value)=="string"){
    //             return !(value.length==4)
    //         }
    //     }
    // ),
  });
    let [tblCtrl,setTblCtrl]=useState(true)
    let [sideWidth,setSideWidth] = useState(10)
    const sideWidthPreset = [
        {sideWidth:3},
        {sideWidth:5},
        {sideWidth:7},
        {sideWidth:10}
      ]

    let [binderSide,setBinderSide] = useState("Front")
    const coverSide = [
    {side:"Front"},
    {side:"Side"},
    ]

//========================================================== useNaviagte 선언
let navigate = useNavigate()
  //========================================================== SlidePopup 작동 redux state 관련 선언
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();
//========================================================== useEffect 코드
useEffect(() => {
    // 이 페이지의 권한 유무 확인
    authCheck()
},[]);

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

  //========================================================== [ADD form에서 추가] 수정할 row Oject state 넘겨받기 위한 코드
  const location = useLocation();
  const targetRowObj= (!location.state ? "N/A" : location.state.rowObj)
  
    function authCheck(){
        if(cookies.load('loginStat')){
            if(cookies.load('userInfo').user_auth.indexOf("MNG_BINDER_INFO",0)!=-1){
                setTblCtrl(true)
            }
            else{
                alert("MNG_BINDER_INFO 권한이 없습니다.")
                navigate('/')
            }

        }
        else{
            alert("로그인 상태가 아닙니다.")
            navigate('/')
        }
    }


    const componentRef = useRef(null);
    function BinderCover(props){

        let binderCoverWidth
        let writingModeStr
        let qrCodeMarginStr
        if (props.binderSide=="Front") {
            qrCodeMarginStr='auto'
            binderCoverWidth='20cm'
            writingModeStr = 'horizontal-tb'
        }
        else {
            qrCodeMarginStr='auto'
            binderCoverWidth = props.sideWidth+'cm'
            writingModeStr = 'vertical-rl'
        }
    
        return (
        <div ref={props.printRef}>
            <div style={{marginLeft:'auto', marginRight:'auto', marginTop:'0.5cm', padding:'0.1cm', width:(binderCoverWidth), height:'28.6cm', textAlign:'center', border:'3px solid', borderColor:'#2196f3',boxSizing:'border-box'}}>
                <Stack spacing={1}>
                    <div style={{width:'99%', justifyItems:(props.binderSide=="Front"?'right':'center')}}>
                        <div style={{display:'flex', justifyContent: (props.binderSide=="Front"?'flex-end':'center')}}>
                            <div style={{width:'2.4cm', hieght:'2.8cm', textAlign:'center', marginTop:(props.binderSide=="Front"?'6px':'0px')}} >
                                <Stack spacing={0}>
                                    <div><QRCode value={targetRowObj.binder_no} quietZone='1' logoImage="public/logo192.png" size='80'  fgColor="#2196f3"/></div>
                                    <div style={{fontSize:'3px'}}><Typography variant='inherit'>{targetRowObj.binder_no}</Typography></div>
                                    <div style={{fontSize:'3px', fontWeight:'bold'}}><Typography variant='inherit'>{targetRowObj.mng_team+" / "+targetRowObj.binder_loc}</Typography></div>
                                    <div style={{fontSize:'3px', fontWeight:'bold'}}><Typography variant='inherit'>{"문서 "+JSON.parse(targetRowObj.relateddoc).length+"건"}</Typography></div>
                                </Stack>
                            </div>
                        </div>
                    </div>
                    <div style={{height: (props.binderSide=="Front"?'10.5cm':'22cm')}}>
                        {
                            props.binderSide=="Front"?<div style={{height:'100px'}}/>:<div></div>
                        }
                        <div style={{writingMode:(writingModeStr), marginLeft:'auto', marginRight:'auto'}}>
                            <Typography variant='h5'>{targetRowObj.binder_title}</Typography>
                        </div>
                    </div>
                    {
                        props.binderSide=="Front"?
                        <div style={{ height:'3cm', display:'flex', flexWrap:'wrap', justifyContent:'center', overflow:'hidden',boxSizing:'border-box'}}>
                            {
                                JSON.parse(targetRowObj.relateddoc).map((oneDoc,i)=>{
                                    return <Chip icon={<DescriptionIcon />} size="small" color="primary" label={oneDoc.doc_no+"("+oneDoc.rev_no+")"}/>
                                })
                            }
                        </div>
                        :<div></div>
                    }
                    <div style={{fontSize:'3px'}}>
                        <Stack spacing={0}>
                            <Typography variant='caption'>{targetRowObj.binder_year}</Typography>
                            <Typography variant='caption'>{"CONFIDENTIAL"}</Typography>
                            <Typography variant='caption'>{"OSONG PLANT"}</Typography>
                            {
                                props.binderSide=="Front"?<Typography variant='caption'>{"Daewoong Pharmaceutical Co., Ltd"}</Typography>:<div></div>
                            }
                            <div style={{fontWeight:'bold'}}><Typography color="primary" variant='caption'>{"CDMS"}</Typography></div>
                        </Stack>
                    </div>
                </Stack>
            </div>
        </div>
        )
    }
    return(
        <div style={{display:'block', padding:'0.5vw'}}>
            <Formik
            validationSchema={schema}
            onSubmit={async (values, {resetForm})=>{

                LoginCheck()
            }}
            initialValues={!location.state ?{

            }:{

            }}
            >
            {({
            handleSubmit,
            handleChange,
            handleBlur,
            validateField,
            values,
            touched,
            resetForm,
            isValid,
            errors,
            })=>(
                <Box
                id="postAddDoc"
                component="form"
                noValidate
                onSubmit={handleSubmit}
                autoComplete="off"
                >
                    <div style={{width:'100vw', marginBottom:'6px', display:'flex', flexWrap:'wrap', justifyContent:'center'}}>
                        <Autocomplete
                        id="coverSide"
                        size="small"
                        style={{width:'100px'}}
                        freeSolo
                        onChange={(event, newValue) => {
                            setBinderSide(newValue);
                        }}
                        value={binderSide}
                        options={coverSide.map((option) => option.side)}
                        renderInput={(params) => <TextField {...params} label="커버 방향" />}
                        />

                        <Autocomplete
                        id="sideWidth"
                        size="small"
                        style={{marginLeft:'10px', width:'100px'}}
                        disabled={(binderSide=="Front")}
                        freeSolo
                        onChange={(event, newValue) => {
                            setSideWidth(newValue);
                        }}
                        value={sideWidth}
                        options={sideWidthPreset.map((option) => option.sideWidth)}
                        renderInput={(params) => <TextField {...params} label="측면 두께" />}
                        />
                    </div>
                    
                    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding:'10px' }} elevation={6}>
                        <div style={{width:'100%', display:'flex', alignItems:'center', backdropFilter:'blur(10px)'}}>
                            <PrintIcon color="primary"/>
                            <Typography variant="BUTTON" component="div" sx={{ flexGrow: 1, overflow:'hidden', marginLeft:'4px' }}>{"바인더 커버 인쇄"}</Typography>
                            <ReactToPrint
                            trigger={() => <Button variant="contained"> <PrintIcon fontSize="small"/></Button>}
                            content={() => componentRef.current}
                            />
                            <Button style={{marginLeft:'1vw'}} size="small" variant="contained" onClick={async ()=>{
                            LoginCheck()
                            navigate(-1)
                            }}>Cancel</Button>
                        </div>
                    </Paper>
            </Box>
        )}</Formik>
        <BinderCover printRef={componentRef} binderSide={binderSide} sideWidth={sideWidth}/>
        <div style={{height:'66px'}}/>
    </div>
    )
}

export default PrintBinder