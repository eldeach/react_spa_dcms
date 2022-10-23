
//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useNavigate, useLocation } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import { Box, Typography, Chip, Button, Stack, Paper,Divider,Modal, TextField  } from '@mui/material/';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import FolderIcon from '@mui/icons-material/Folder';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
//========================================================== QR Reader 라이브러리 import
import { QrReader } from 'react-qr-reader';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setSel_tb_user,setLoginExpireTime } from "./../store.js"
//========================================================== MngTable 컴포넌트 import
import MngTable from './../MngTable/MngTable'
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


function ExportBinder(){
    //========================================================== [변수] QR Render 스캔&출고처리상태 제어 State
    let [startScan, setStartScan] = useState(false);
    let [qrData, setQrData] = useState("");
    let [scanTimeStamp,setScanTimeStamp]=useState();
    let [veryEarly,setVeryEarly]= useState(true);
    let [exportDone,setExportDone]=useState(false)

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

    //========================================================== Formik & yup Validation schema
    const schema = yup.object().shape({
        user_pw: yup.string()
        .required('비밀번호를 입력해주세요.')
    });

    //========================================================== [변수] popup 작동 제어 State
    let [popUpPage,setPopUpPage] = useState(0);



    //========================================================== [변수, 객체 선언][useNaviagte]
    let navigate = useNavigate()

    //========================================================== [변수][redux]
    let rdx = useSelector((state) => { return state } )
    let dispatch = useDispatch();

    //========================================================== [변수, 객체 선언][useEffect]
    useEffect(() => {
        // 이 페이지의 권한 유무 확인
        authCheck()

        //값 초기화
        dispatch(setSel_tb_user({}))
    },[]);
    //========================================================== [함수][권한] 권한 점검
    function authCheck(){
        if(cookies.load('loginStat')){
            if(cookies.load('userInfo').user_auth.indexOf("EXPORT_BINDER",0)!=-1){
    
            }
            else{
                alert("EXPORT_BINDER 권한이 없습니다.")
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
    //========================================================== [함수] 출고처리
    async function putBinderExportLoc(qryBody){
        let ajaxData = await axios.put("/putbinderexportloc",qryBody)
        .then((res)=>res.data)
        .catch((err)=>{
            console.log(err)
        })

        if(ajaxData.success){
            setExportDone(true)
            return ajaxData.result
        }
        else alert(JSON.stringify(ajaxData))
    }
    
    //========================================================== [Modal] 모달 열기/닫기 및 스타일 정의
    let [openModal, setOpenModal] = useState(false);
    let handleModalOpen = () => setOpenModal(true);
    let handleModalClose = () => setOpenModal(false);
    let [modalTitle,setModalTitle] = useState(false);
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height:'600px',
        overflow:'auto',
        padding:'20px'
    };
    
    return(
        <div style={{padding:'0.5vw'}}>
        <Formik
        validationSchema={schema}
        onSubmit={async (values, {resetForm})=>{
            let user_sign =  await axios({
                method:"get",
                url:"/signpw",
                params:{
                    user_account : cookies.load('userInfo').user_account,
                    user_pw : values.user_pw
                },
                headers:{
                    'Content-Type':'application/json'
            }})
            .then((res)=>res.data)
            .catch((err)=>console.log(err))
            if(user_sign.signStat){
                let user_info={
                    user_account:rdx.sel_tb_user.user_account,
                    user_name:rdx.sel_tb_user.user_name,
                    user_team:rdx.sel_tb_user.user_team
                }
                let qryBody = {
                    binder_no:qrData,
                    current_loc:user_info,    
                    update_by:cookies.load('userInfo').user_account
                }
                let ajaxData = await putBinderExportLoc(qryBody)
                console.log(ajaxData)

                resetForm()
            }
            else{
                alert(user_sign.msg)
            }
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
                    <Paper className="seperate-paper-long" elevation={3}>
                        <Stack spacing={2}>
                            <Chip label="바인더 정의" color="primary"/>
                            <Button size="small" variant="contained" onClick={()=>{
                                setStartScan(!startScan)
                                setVeryEarly(false)
                                dispatch(setSel_tb_user({}))
                                setExportDone(false)
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
                                qrData?<Button disabled={exportDone} size="small" variant="contained" onClick={()=>{
                                        setPopUpPage(0) 
                                        setModalTitle("요창자 선택")
                                        handleModalOpen()
                                        LoginCheck()
                                        }}>대출 요청자 선택</Button>
                                        :<div></div>
                            }
                            {
                                rdx.sel_tb_user.user_account?
                                <Stack spacing={2}>
                                    <Chip icon={<AccountCircleIcon/>} label={rdx.sel_tb_user.user_account} color="primary"/>
                                    <Chip icon={<BadgeIcon/>} label={rdx.sel_tb_user.user_name} color="primary"/>
                                    <Chip icon={<Diversity3OutlinedIcon/>} label={rdx.sel_tb_user.user_team} color="primary"/>
                                </Stack>
                                :<div></div>
                            }
                            {
                                qrData&&scanTimeStamp&&rdx.sel_tb_user.user_account&&!exportDone?<Chip icon={<AdminPanelSettingsIcon/>} label={"출고 담당자 : " + cookies.load('userInfo').user_name+" 님"} color="primary"/>:<div/>
                            }
                            {
                                qrData&&scanTimeStamp&&rdx.sel_tb_user.user_account&&!exportDone?
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <LockIcon  sx={{ color: 'action.active', mt:3.5, mr: 1}} />
                                    <TextField
                                    required
                                    size="small"
                                    variant="standard"
                                    id="user_pw"
                                    name="user_pw"
                                    label="출고 담당자 전자서명"
                                    type="password"
                                    value={values.user_pw}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={touched.user_pw ? errors.user_pw : ""}
                                    error={touched.user_pw && Boolean(errors.user_pw)}
                                    margin="dense"
                                    fullWidth
                                    />
                                </Box>
                                :<div/>
                            }

                            {
                                exportDone?<Chip icon={<CheckCircleOutlineIcon/>} label={"출고처리 완료"} color="confirm"/>:<div></div>
                            }
                        </Stack>
                    </Paper>
                </div>
                <div style={{height:'48px'}}/>
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding:'10px' }} elevation={6}>
                    <div style={{width:'100%', display:'flex', alignItems:'center', backdropFilter:'blur(10px)'}}>
                        <OpenInNewIcon color="primary"/>
                        <Typography variant="BUTTON" component="div" sx={{ flexGrow: 1, overflow:'hidden', marginLeft:'4px' }}>{"바인더 출고 처리"}</Typography>
                        <Button size="small" disabled={!qrData||!rdx.sel_tb_user.user_account||exportDone} variant="contained" type="submit" form="putBinderCurrentLoc" >출고</Button>
                        <Button style={{marginLeft:'1vw'}} size="small" variant="contained" onClick={async ()=>{
                        LoginCheck()
                        navigate(-1)
                        }}>Cancel</Button>
                    </div>
                </Paper>
            </Box>
        )}</Formik>
        <Modal open={openModal} onClose={handleModalClose}>
            <Paper style={modalStyle} elevation={5}>
                <div style={{width: '100%', display: 'block'}}>
                <div style={{width:'100%',display:'flex'}}>
                    <div style={{width:'50%',display:'flex', alignItems:'center', justifyContent:'flex-start'}}>
                    <PrivacyTipIcon color="primary"/>
                    <div>{modalTitle}</div>
                    </div>
                    <div style={{width:'50%',display:'flex', alignItems:'center', justifyContent:'flex-end'}}>
                    <Button size="small" variant="outlined" onClick={()=>{
                        handleModalClose()
                        LoginCheck()
                        }}>Close</Button>
                    </div>
                </div>
                <Divider style={{marginTop:'5px',marginBottom:'10px'}}/>
                {
                    popUpPage==0?<MngTable getUrlStr={'/getgroupwareuser'} targetPk={{}} heightValue={'72vh'} tblCtrl={true} chkSel={false} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                    <div></div>
                }                    
                </div>
            </Paper>
        </Modal>
        </div>
    )
}

export default ExportBinder