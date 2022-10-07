
//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import { Box, Typography, Chip, Button, Stack, Paper } from '@mui/material/';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import FolderIcon from '@mui/icons-material/Folder';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
//========================================================== QR Reader 라이브러리 import
import { QrReader } from 'react-qr-reader';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setLoginExpireTime } from "./../store.js"
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './../Account/LoginSessionCheck.js';
//========================================================== Formik & Yup 라이브러리 import
import { Formik } from 'formik';
import * as yup from 'yup';
//========================================================== axios 라이브러리 import
import axios from 'axios';
//========================================================== Moment 라이브러리 import
import moment from 'moment';
import 'moment/locale/ko';	//대한민국


function ImportBinder(){
    //========================================================== [변수] QR Render 스캔&입고처리상태 제어 State
    let [startScan, setStartScan] = useState(false);
    let [qrData, setQrData] = useState("");
    let [scanTimeStamp,setScanTimeStamp]=useState();
    let [importDone,setImportDone]=useState(false)
    let [veryEarly,setVeryEarly]= useState(true);

    //========================================================== [함수] QR Render 스캔
    let handleScan = async (scanData) => {
    console.log(`loaded data data`, scanData);
    if (scanData && scanData !== "") {
        console.log(`loaded >>>`, scanData);
        setQrData(scanData.text);
        setScanTimeStamp(scanData.timestamp)
        setStartScan(false);
    }
    };
    let handleError = (err) => {
    console.error(err);
    };

    //========================================================== [변수, 객체 선언][useNaviagte]
    let navigate = useNavigate()

    //========================================================== SlidePopup 작동 redux state 관련 선언
    let rdx = useSelector((state) => { return state } )
    let dispatch = useDispatch();
    //========================================================== Formik & yup Validation schema
    const schema = yup.object().shape({

    });
    //========================================================== [변수, 객체 선언][useEffect]
    useEffect(() => {
        // 이 페이지의 권한 유무 확인
        authCheck()
    },[]);
    //========================================================== [함수][권한] 권한 점검
    function authCheck(){
        if(cookies.load('loginStat')){
            if(cookies.load('userInfo').user_auth.indexOf("MNG_USER_AUTH",0)!=-1){

            }
            else{
                alert("MNG_USER_AUTH 권한이 없습니다.")
                navigate('/')
            }

        }
        else{
            alert("로그인 상태가 아닙니다.")
            navigate('/')
        }
    }
    //========================================================== [함수] 로그인 타이머 업데이트
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

    //========================================================== [함수] 정위치 입고처리
    async function putBinderImportLoc(qryBody){
        let ajaxData = await axios.put("/putbinderimportloc",qryBody)
        .then((res)=>res.data)
        .catch((err)=>{
            console.log(err)
        })

        if(ajaxData.success){
            setImportDone(true)
            return ajaxData.result
        }
        else alert(JSON.stringify(ajaxData))
    }
    
    return(
        <div style={{padding:'0.5vw'}}>
        <Formik
        validationSchema={schema}
        onSubmit={async (values, {resetForm})=>{
            let qryBody = {
                binder_no:qrData,    
                update_by:cookies.load('userInfo').user_account
            }
            let ajaxData = await putBinderImportLoc(qryBody)
            console.log(ajaxData)

            resetForm()
            LoginCheck()

        }}
        initialValues={{

        }}
        >
        {({
        handleSubmit,
        handleChange={},
        handleBlur,
        validateField,
        values,
        touched,
        resetForm,
        isValid,
        errors,
        })=>(
            <Box
            id="putBinderCurrentLoc"
            component="form"
            noValidate
            onSubmit={handleSubmit}
            autoComplete="off"
            >
                <div style={{width:'100%', display:'flex', flexWrap:'wrap', justifyContent:'center'}}>
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <Chip label="바인더 정의" color="primary"/>
                            <Button size="small" variant="contained" onClick={()=>{
                                setStartScan(!startScan)
                                setVeryEarly(false)
                                setImportDone(false)
                                setQrData("")
                                setScanTimeStamp(null)
                            }}>{startScan ? "읽기 중지" : "QR 읽기"}</Button>
                            {
                                startScan?
                                <QrReader
                                constraints={{facingMode: "environment"} }
                                delay={1000}
                                onError={handleError}
                                onResult={handleScan}
                                style={{ width: "100%" }}
                                />
                                :<div></div>
                            }
                            {
                                qrData? <Chip icon={<FolderIcon/>} label={qrData} color="primary"/>:<div></div>
                                
                            }
                            {
                                scanTimeStamp?<Chip icon={<QrCodeScannerIcon/>} label={"스캔시각 : "+moment(new Date(scanTimeStamp)).format('YYYY-MM-DD HH:mm:ss')} color="primary"/>:<div></div>
                            }
                            {
                                importDone?<Chip icon={<CheckCircleOutlineIcon/>} label={"입고처리 완료"} color="confirm"/>:<div></div>
                            }
                        </Stack>
                    </Paper>
                </div>
                <div style={{height:'48px'}}/>
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding:'10px' }} elevation={6}>
                    <div style={{width:'100%', display:'flex', alignItems:'center', backdropFilter:'blur(10px)'}}>
                        <SystemUpdateAltIcon color="primary"/>
                        <Typography variant="BUTTON" component="div" sx={{ flexGrow: 1, overflow:'hidden', marginLeft:'4px' }}>{"바인더 입고 처리"}</Typography>
                        <Button size="small" disabled={!qrData||importDone} variant="contained" type="submit" form="putBinderCurrentLoc" >입고</Button>
                        <Button style={{marginLeft:'1vw'}} size="small" variant="contained" onClick={async ()=>{
                        LoginCheck()
                        navigate(-1)
                        }}>Cancel</Button>
                    </div>
                </Paper>
            </Box>
        )}</Formik>
        </div>
    )
}

export default ImportBinder