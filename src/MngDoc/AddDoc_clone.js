
//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useNavigate, useLocation } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import {PropTypes, Autocomplete, Switch, FormControlLabel, TextField, IconButton, Box, Typography, Chip, Button, Stack, Paper,Divider,Modal, ListItemIcon, ListItemText, ListItem, List } from '@mui/material/';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//---------------------------------------------------------- Material Icons
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
//========================================================== Moment 라이브러리 import
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setSel_tb_user,setLoginExpireTime, setSel_doc_no, setSel_doc, setSelTmmsWholeAsset, setSelSapZmmr1010, setSelEqmsAtemplate, setSelTmmsLocation } from "./../store.js"
//========================================================== MngTable 컴포넌트 import
import MngTable from './../MngTable/MngTable'
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './../Account/LoginSessionCheck.js';
//========================================================== Formik & Yup 라이브러리 import
import { Formik } from 'formik';
import * as yup from 'yup';
//========================================================== axios 라이브러리 import
import axios from 'axios';

function AddDoc() {

    let [appDate,setAppDate] = useState(null);
    let [invDate,setInvDate] = useState(null);

    let [startDate,setStartDate] = useState(null);
    let [completionDate,setCompletionDate] = useState(null);

    let [isProtocol,setIsProtocol] = useState(false);
    let isProtocolHandleChange = (event) => {
        if(startDate || completionDate){
            alert('수행기간 필드는 실제 수행기간을 입력하는 필드입니다.\n수행기간 정보를 삭제 후 계획서로 구분 가능합니다.')
        }
        else{
            setIsProtocol(event.target.checked)
        } 
    }

    const qualAttList=[
        {abb:"URS", att_name: "User Requirement Specification"},
        {abb:"RA", att_name: "Risk Analysis"},
        {abb:"IA", att_name: "Impact Assessment"},
        {abb:"VA", att_name: "Vendor Audit"},
        {abb:"FS", att_name: "Functional Specification"},
        {abb:"DFS", att_name: "Detail Functional Specification"},
        {abb:"SFS", att_name: "Software Functional Specification"},
        {abb:"HFS", att_name: "Hardware Functional Specification"},
        {abb:"DS", att_name: "Design Specification"},
        {abb:"SDS", att_name: "Software Design Specification"},
        {abb:"HDS", att_name: "Hardware Design Specification"},
        {abb:"DDS", att_name: "Detail Design Specification"},
        {abb:"FDS", att_name: "Functional & Design Specification"},
        {abb:"DQ", att_name: "Design Qualification"},
        {abb:"FAT", att_name: "Factory Acceptance Test"},
        {abb:"SAT", att_name: "Site Acceptance Test"},
        {abb:"IQ", att_name: "Installation Qualification"},
        {abb:"OQ", att_name: "Operational Qualification"},
        {abb:"PQ", att_name: "Performance Qualification"},
        {abb:"STER", att_name: "Sterilization Qualification"},
        {abb:"VHP", att_name: "VHP Qualification"},
        {abb:"Initial", att_name: "Initial Qualification"},
        {abb:"Periodic", att_name: "Periodic Requalification"},
        {abb:"SFT", att_name: "System Functional Test"},
        {abb:"TAB", att_name: "Testing, Adjusting and Balancing"},
        {abb:"VSR", att_name: "Validation  Summary Report"},
        {abb:"RTM", att_name: "Requirment Trace Matrix"},
        {abb:"MT", att_name: "Mapping Test"},
        {abb:"ETC", att_name: "Etcetera"},
    ]
    let [qualAttFiled,setQualAttFiled]=useState();
    let [qualAtt,setQualAtt] = useState([])

    const valAttList = [
        {abb:"VMP",att_name:"Validation Master Plan"},
        {abb:"VMR",att_name:"Validation Master Report"},
        {abb:"VP",att_name:"Validation Plan"},
        {abb:"PV",att_name:"Process Validation"},
        {abb:"OPV",att_name:"On-going Process Validation"},
        {abb:"CV",att_name:"Cleaning Validation"},
        {abb:"MV",att_name:"Method Validation"},
        {abb:"VF",att_name:"Verification"},
        {abb:"CMV",att_name:"Cleaning Method Validation"},
        {abb:"RT",att_name:"Recovery Test"},
        {abb:"APV",att_name:"Aseptic Process Validation"},
        {abb:"IA",att_name:"Impact Assessment"},
        {abb:"RA",att_name:"Risk Assessment"},
        {abb:"SV",att_name:"Shipping Validation"},
        {abb:"HTS",att_name:"Holding Time Study"},
        {abb:"CHT",att_name:"Cleaning Holding Time"},
        {abb:"CSV",att_name:"Computerized System Validation"},
        {abb:"ESV",att_name:"Excel Sheet Validation"},
        {abb:"ET",att_name:"Etcetera"},
        {abb:"TT",att_name:"Technical Transfer"},
        {abb:"FT",att_name:"Feasibility Test"},
    ]
    let [valAttFiled,setValAttFiled]=useState();
    let [valAtt, setValAtt] = useState([])


    const docAttList = [
        {abb:"DWG",att_name:"Drawing"},
        {abb:"PAR",att_name:"Production A Report"},
        {abb:"PCR",att_name:"Production C Report"},
        {abb:"QCAR",att_name:"Quality Control A Report"},
        {abb:"QCCR",att_name:"Quality Control C Report"},
        {abb:"P2R",att_name:"Packaging 2 Report"},
        {abb:"QAR",att_name:"Quality Assurance Report"},
        {abb:"LOR",att_name:"Logistics Report"},
        {abb:"ENR",att_name:"Engineering Report"},
        {abb:"PMR",att_name:"Production Management Report"},
        {abb:"TOR",att_name:"Technical Operations Report"},
        {abb:"QAOD",att_name:"Official Document"},

    ]
    let [docAttFiled,setDocAttFiled]=useState();
    let [docAtt, setDocAtt] = useState([])

      //========================================================== Formik & yup Validation schema
  const schema = yup.object().shape({
    doc_title: yup.string()
    .required('문서제목을 입력해주세요.')
    .test(
        'title_return',
        "줄바꿈은 없어야 합니다.",
        function(value){
            if(typeof(value)=="string"){
                return !value.includes("\n")
            }
        }
    ),
  });

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
    width: '90vw',
    height:'90vh',
    overflow:'auto',
    padding:'20px'
  };

  let [popUpPage,setPopUpPage] = useState(0);
  let [isSubmitting, setIsSubmitting] = useState(false); // Submit 중복 클릭 방지

  //========================================================== [변수, 객체 선언][useNaviagte]
  let navigate = useNavigate()

  //========================================================== SlidePopup 작동 redux state 관련 선언
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();
  let [reLoad,setReLoad] = useState(false)

  //========================================================== [변수, 객체 선언][useEffect]
  useEffect(() => {
    // 이 페이지의 권한 유무 확인
    authCheck()

    //값 초기화
    if(targetRowObj=="N/A"){
        dispatch(setSel_doc_no({}))
        dispatch(setSel_tb_user({}))
        dispatch(setSelTmmsWholeAsset([]))
        dispatch(setSelTmmsLocation([]))
        dispatch(setSelSapZmmr1010([]))
        dispatch(setSelEqmsAtemplate([]))
        dispatch(setSel_doc([]))
    }
    else{
        if(targetRowObj.approval_date==0) setAppDate(null)
        else setAppDate(targetRowObj.approval_date);

        if(targetRowObj.invalid_date==0) setInvDate(null)
        else setInvDate(targetRowObj.invalid_date);

        if(targetRowObj.imp_start_date==0) setStartDate(null)
        else setStartDate(targetRowObj.imp_start_date);

        if(targetRowObj.imp_completion_date==0) setCompletionDate(null)
        else setCompletionDate(targetRowObj.imp_completion_date);

        if(targetRowObj.isprotocol=='1'){
            setIsProtocol(isProtocol=>true)
        }
        else{
            setIsProtocol(isProtocol=>false)
        }
        setDocAtt(JSON.parse(targetRowObj.docAtt))
        setValAtt(JSON.parse(targetRowObj.valAtt))
        setQualAtt(JSON.parse(targetRowObj.qualAtt))
        dispatch(setSel_doc_no({doc_no:targetRowObj.doc_no, newRevNo:targetRowObj.rev_no}))
        dispatch(setSel_tb_user({user_account:targetRowObj.written_by, user_name:targetRowObj.user_name, user_team:targetRowObj.written_by_team }))
        dispatch(setSelTmmsWholeAsset(JSON.parse(targetRowObj.eqAtt)))
        dispatch(setSelTmmsLocation(JSON.parse(targetRowObj.locAtt)))
        dispatch(setSelSapZmmr1010(JSON.parse(targetRowObj.prodAtt)))
        dispatch(setSelEqmsAtemplate(JSON.parse(targetRowObj.eqmsAtt)))
        dispatch(setSel_doc(JSON.parse(targetRowObj.relateddoc)))
        setUserTeam(()=>targetRowObj.written_by_team)
    }

    getTeams()

  },[]);


  let [teamList, setTeamList]=useState([]);
  let [userTeam,setUserTeam]=useState();
  async function getTeams(){
    let getTeamsResult = await axios.get("/getteams")
    let teamTempList=[]
    getTeamsResult.data.result.map((oneTeam,i)=>{
        if(!oneTeam.user_team){
        }
        else
        {
            teamTempList.push(oneTeam.user_team)
        }
    })
    setTeamList(teamTempList)
  }

  //========================================================== [ADD form에서 추가] 수정할 row Oject state 넘겨받기 위한 코드
  const location = useLocation();
  const targetRowObj= (!location.state ? "N/A" : location.state.rowObj)

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

  //========================================================== [함수][권한] 권한 점검
  function authCheck(){
    if(cookies.load('loginStat')){
      if(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_INFO",0)!=-1){

      }
      else{
          alert("MNG_DOC_INFO 권한이 없습니다.")
          navigate('/')
      }

    }
    else{
        alert("로그인 상태가 아닙니다.")
        navigate('/')
    }
  }

  async function postAddDoc(qryBody){
    let ajaxData = await axios.post("/postAddDoc",qryBody)
    .then((res)=>res.data)
    .catch((err)=>{
      console.log(err)
    })

    if(ajaxData.success) return ajaxData.result
    else alert(ajaxData)
  }

  async function putEditDoc(qryBody){
    let ajaxData = await axios.put("/puteditdoc",qryBody)
    .then((res)=>res.data)
    .catch((err)=>{
      console.log(err)
    })

    if(ajaxData.success) return ajaxData.result
    else console.log(ajaxData)
  }

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }


  return (
    <div style={{padding:'0.5vw'}}>
        <Formik
        validationSchema={schema}
        onSubmit={async (values, {resetForm})=>{
            setIsSubmitting(true);
            if(!rdx.sel_doc_no.doc_no||!rdx.sel_tb_user.user_account||!appDate){
                alert("문서번호 선택 또는 사용자 선택, 승인일이 입력되지 않았습니다.")
            }
            else if(startDate && !completionDate){
                alert("수행기간은 시작일과 종료일 모두 입력해야합니다.\n수행기간이 하루이면 동일한 날짜로 시작일과 종료일을 입력해주세요.")
            }
            else if(!startDate && completionDate){
                alert("수행기간은 시작일과 종료일 모두 입력해야합니다.\n수행기간이 하루이면 동일한 날짜로 시작일과 종료일을 입력해주세요.")
            }
            else{
                if(targetRowObj=="N/A"){
                    let qryBody = {
                        doc_no:rdx.sel_doc_no.doc_no,
                        rev_no:rdx.sel_doc_no.newRevNo,
                        doc_title:values.doc_title,
                        written_by:rdx.sel_tb_user.user_account,
                        written_by_team:rdx.sel_tb_user.user_team,
                        approval_date:moment(new Date(appDate)).format('YYYY-MM-DD'),
                        invalid_date:moment(new Date(invDate)).format('YYYY-MM-DD'),
                        imp_start_date:moment(new Date(startDate)).format('YYYY-MM-DD'),
                        imp_completion_date:moment(new Date(completionDate)).format('YYYY-MM-DD'),
                        docAtt: JSON.stringify(docAtt),
                        qualAtt: JSON.stringify(qualAtt),
                        valAtt: JSON.stringify(valAtt),
                        eqAtt: JSON.stringify(rdx.selTmmsWholeAsset),
                        locAtt: JSON.stringify(rdx.selTmmsLocation),
                        prodAtt: JSON.stringify(rdx.selSapZmmr1010),
                        eqmsAtt: JSON.stringify(rdx.selEqmsAtemplate),
                        isprotocol: isProtocol,
                        relateddoc: JSON.stringify(rdx.sel_doc),
                        remark:values.remark,
                        insert_by:cookies.load('userInfo').user_account
                    }
                    
                    let ajaxData = await postAddDoc(qryBody)
                    console.log(ajaxData)
                }
                else{
                    let qryBody = {
                        doc_no:rdx.sel_doc_no.doc_no,
                        rev_no:rdx.sel_doc_no.newRevNo,
                        doc_title:values.doc_title,
                        written_by:rdx.sel_tb_user.user_account,
                        written_by_team:rdx.sel_tb_user.user_team,
                        approval_date:moment(new Date(appDate)).format('YYYY-MM-DD'),
                        invalid_date:moment(new Date(invDate)).format('YYYY-MM-DD'),
                        imp_start_date:moment(new Date(startDate)).format('YYYY-MM-DD'),
                        imp_completion_date:moment(new Date(completionDate)).format('YYYY-MM-DD'),
                        docAtt: JSON.stringify(docAtt),
                        qualAtt: JSON.stringify(qualAtt),
                        valAtt: JSON.stringify(valAtt),
                        eqAtt: JSON.stringify(rdx.selTmmsWholeAsset),
                        locAtt: JSON.stringify(rdx.selTmmsLocation),
                        prodAtt: JSON.stringify(rdx.selSapZmmr1010),
                        eqmsAtt: JSON.stringify(rdx.selEqmsAtemplate),
                        isprotocol: isProtocol,
                        relateddoc: JSON.stringify(rdx.sel_doc),
                        remark:values.remark,
                        update_by:cookies.load('userInfo').user_account,
                        uuid_binary:targetRowObj.uuid_binary
                    }
                    let ajaxData = await putEditDoc(qryBody)
                    console.log(ajaxData)
                    navigate(-1)
                }
                resetForm()
                setDocAtt([])
                //setValAttFiled(null)
                setValAtt([])
                //setQualAttFiled(null)
                setQualAtt([])
                setIsProtocol(false)
                setAppDate(null)
                setInvDate(null)
                setStartDate(null)
                setCompletionDate(null)
                dispatch(setSel_doc_no({}))
                dispatch(setSel_tb_user({}))
                dispatch(setSelTmmsWholeAsset([]))
                dispatch(setSelTmmsLocation([]))
                dispatch(setSelSapZmmr1010([]))
                dispatch(setSelEqmsAtemplate([]))
                dispatch(setSel_doc([]))
            }

            setIsSubmitting(false);
            LoginCheck()

        }}
        initialValues={!location.state ?{
            doc_title:'',
            remark:''
        }:{
            doc_title:targetRowObj.doc_title,
            remark:targetRowObj.remark
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
            id="postAddDoc"
            component="form"
            onKeyDown={onKeyDown}
            noValidate
            onSubmit={handleSubmit}
            autoComplete="off"
            >
                <div style={{width:'100%', display:'flex', flexWrap:'wrap', justifyContent:'center'}}>
                    <Paper className="seperate-paper" elevation={3}>   
                        <Stack spacing={2}>
                            <Button disabled={!(targetRowObj=="N/A")} size="small" variant="contained" onClick={()=>{
                            setPopUpPage(0)
                            setModalTitle("문서번호 선택")
                            handleModalOpen()
                            LoginCheck()
                            }}>문서번호 선택</Button>
                            <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                                <Chip label="문서번호" color="primary"/>
                                <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center'}}><div>{rdx.sel_doc_no.doc_no}</div></div>
                            </Stack>
                            <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                                <Chip label="개정번호" color="primary"/>
                                <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center'}}><div>{rdx.sel_doc_no.newRevNo}</div></div>
                            </Stack>
                            {/* <div style={{height:"10px"}}/> */}
                            <Button size="small" variant="contained" onClick={()=>{
                            setPopUpPage(4) 
                            setModalTitle("요창자 선택")
                            handleModalOpen()
                            LoginCheck()
                            }}>작성자 선택</Button>
                            <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                                <Chip label="작성자" color="primary"/>
                                <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center'}}><div>{rdx.sel_tb_user.user_account}{rdx.sel_tb_user.user_name?" ("+rdx.sel_tb_user.user_name+")":""}</div></div>
                            </Stack>
                            <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                                <Chip label="작성팀" color="primary"/>
                                <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center'}}><div>{rdx.sel_tb_user.user_team}</div></div>
                            </Stack>
                            <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                    <Chip label="작성팀 변경" color="primary"/>
                                </div>
                                <Autocomplete
                                value={userTeam}
                                onChange={(event, newValue) => {
                                    setUserTeam(()=>newValue)
                                }}
                                disabled={!rdx.sel_tb_user.user_account}
                                disablePortal
                                size="small"
                                id="mngTeam"
                                options={teamList.map((option) => option)}
                                sx={{ flexGrow:1, marginRight:'10px'}}
                                renderInput={(params) => <TextField {...params} color="primary" label="작성팀" />}
                                />
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                    <Button disabled={!rdx.sel_tb_user.user_account} size="small" variant="contained" onClick={()=>{
                                            dispatch(setSel_tb_user({user_account:rdx.sel_tb_user.user_account, user_name:rdx.sel_tb_user.user_name, user_team:userTeam }))
                                    }}>변경</Button>
                                </div>
                            </Stack>
                            <FormControlLabel
                                control={
                                <Switch checked={isProtocol} onChange={isProtocolHandleChange} name="gilad" />
                                }
                                label="이 문서는 계획서 입니다."
                            />
                        </Stack>
                    </Paper>
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <Chip label="문서 승인정보 입력" color="primary"/>
                            <TextField
                            required
                            variant="outlined"
                            id="doc_title"
                            name="doc_title"
                            label="Title"
                            multiline
                            rows={2}
                            value={values.doc_title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={touched.doc_title ? errors.doc_title : ""}
                            error={touched.doc_title && Boolean(errors.doc_title)}
                            margin="dense"
                            fullWidth
                            />
                            <div style={{width:'100%',display:'flex', marginTop:'20px'}}>
                                <div style={{ flexGrow:1, display:'block', marginRight:'10px'}}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                        fullWidth
                                        label="Approve Date"
                                        inputFormat={"YYYY-MM-DD"}
                                        mask={"____-__-__"}
                                        value={appDate}
                                        onChange={(newValue) => {
                                            setAppDate(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} color="primary"/>}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                    <Button size="small" variant="contained" onClick={()=>{
                                        setAppDate(new Date());
                                    }}>오늘</Button>
                                </div>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                    <Button size="small" variant="contained" onClick={()=>{
                                        setAppDate(null);
                                    }}>삭제</Button>
                                </div>
                            </div>
                            <div style={{width:'100%',display:'flex', marginTop:'20px'}}>
                                <div style={{ flexGrow:1, display:'block', marginRight:'10px'}}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                        fullWidth
                                        label="Invalid Date"
                                        inputFormat={"YYYY-MM-DD"}
                                        mask={"____-__-__"}
                                        value={invDate}
                                        onChange={(newValue) => {
                                            setInvDate(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} color="primary"/>}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                    <Button size="small" variant="contained" onClick={()=>{
                                        setInvDate(new Date());
                                    }}>오늘</Button>
                                </div>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                    <Button size="small" variant="contained" onClick={()=>{
                                        setInvDate(null);
                                    }}>삭제</Button>
                                </div>
                            </div>
                            <TextField
                            required
                            variant="outlined"
                            id="remark"
                            name="remark"
                            label="Remark"
                            multiline
                            rows={2}
                            value={values.remark}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={touched.remark ? errors.remark : ""}
                            error={touched.remark && Boolean(errors.remark)}
                            margin="dense"
                            fullWidth
                            />
                        </Stack>
                    </Paper>
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <Chip label="수행기간" color="primary"/>
                            <div style={{width:'100%',display:'flex', marginTop:'20px'}}>
                                <div style={{ flexGrow:1, display:'block', marginRight:'10px'}}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                        disabled={isProtocol}
                                        fullWidth
                                        label="Start Date"
                                        inputFormat={"YYYY-MM-DD"}
                                        mask={"____-__-__"}
                                        value={startDate}
                                        onChange={(newValue) => {
                                            let dateA = new Date(newValue)
                                            let dateB = new Date(completionDate)
                                            if((dateA.getTime()-dateB.getTime()>0)){
                                                if(!completionDate) setStartDate(newValue);
                                                else alert ("시작일은 종료일보다 앞서야합니다.")
                                            }
                                            else setStartDate(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} color="primary"/>}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                    <Button disabled={isProtocol} size="small" variant="contained" onClick={()=>{
                                        
                                        let dateA = new Date(new Date())
                                        let dateB = new Date(completionDate)
                                        if((dateA.getTime()-dateB.getTime()>0)){
                                            if(!completionDate) setStartDate(new Date());
                                            else alert ("시작일은 종료일보다 앞서야합니다.")
                                        }
                                        else setStartDate(new Date());
                                        
                                    }}>오늘</Button>
                                </div>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                    <Button disabled={isProtocol} size="small" variant="contained" onClick={()=>{
                                        setStartDate(null);
                                    }}>삭제</Button>
                                </div>
                            </div>
                            <div style={{width:'100%',display:'flex', marginTop:'20px'}}>
                                <div style={{ flexGrow:1, display:'block', marginRight:'10px'}}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                        disabled={isProtocol}
                                        fullWidth
                                        label="Completion Date"
                                        inputFormat={"YYYY-MM-DD"}
                                        mask={"____-__-__"}
                                        value={completionDate}
                                        onChange={(newValue) => {
                                            let dateA = new Date(startDate)
                                            let dateB = new Date(newValue)
                                            if((dateA.getTime()-dateB.getTime()>0)){
                                                alert ("시작일은 종료일보다 앞서야합니다.")
                                            }
                                            else setCompletionDate(newValue);
                                            
                                        }}
                                        renderInput={(params) => <TextField {...params} color="primary"/>}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                    <Button disabled={isProtocol} size="small" variant="contained" onClick={()=>{
                                        let dateA = new Date(startDate)
                                        let dateB = new Date(new Date())
                                        if((dateA.getTime()-dateB.getTime()>0)){
                                            alert ("시작일은 종료일보다 앞서야합니다.")
                                        }
                                        else setCompletionDate(new Date());
                                    }}>오늘</Button>
                                </div>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                    <Button disabled={isProtocol} size="small" variant="contained" onClick={()=>{
                                        setCompletionDate(null);
                                    }}>삭제</Button>
                                </div>
                            </div>
                            <Button disabled={isProtocol} size="small" variant="contained" onClick={()=>{
                                setCompletionDate(startDate)
                            }}>시작일에 종료일 맞추기</Button>
                            {
                                isProtocol ? <Chip label="본 필드는 실제 수행기간을 입력하는 필드입니다." size="small" variant="outlined" color="info"/> : <div/>
                            }
                        </Stack>
                    </Paper>
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <div style={{width:'100%',display:'flex'}}>
                                <Autocomplete
                                value={docAttFiled}
                                onChange={(event, newValue) => {
                                setDocAttFiled({abb:newValue.split(" : ")[0], att_name : newValue.split(" : ")[1]});
                                }}
                                disablePortal
                                size="small"
                                id="docAttList"
                                options={docAttList.map((option) => option.abb + " : " + option.att_name)}
                                sx={{ flexGrow:1, marginRight:'10px'}}
                                renderInput={(params) => <TextField {...params} color="primary" label="문서 성격 추가" />}
                                />
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                                    <Button size="small" variant="contained" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_DOCATT",0)==-1)} onClick={()=>{
                                        if(docAttFiled){
                                            let tempArr = [...docAtt]

                                            let dupAbbCheck=false
                                            tempArr.map((oneItem,i)=>{
                                                if(oneItem.abb==docAttFiled.abb) dupAbbCheck=true
                                            })
                                            if(!dupAbbCheck) tempArr.push(docAttFiled)

                                            setDocAtt(tempArr)
                                            LoginCheck()
                                        }
                                    }}>추가</Button>
                                </div>
                            </div>
                            <div style={{width:'100%', height:'294px', overflowY:'auto', boxSizing:'border-box'}}>
                                <List>
                                    {
                                        docAtt.map((oneAtt,i)=>{
                                            return(
                                                <ListItem
                                                style={{ width: "100%" }}
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_DOCATT",0)==-1)} onClick={()=>{
                                                        let temp = [...docAtt]
                                                        temp.splice(i,1)
                                                        setDocAtt(temp)
                                                    }}>
                                                    <DeleteIcon />
                                                    </IconButton>
                                                }
                                                >
                                                <ListItemIcon>
                                                    <SettingsApplicationsIcon color='primary'/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={oneAtt.abb}
                                                    secondary={oneAtt.att_name}
                                                />
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                            <Button size="small" variant="contained" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_DOCATT",0)==-1)} onClick={()=>{
                                setDocAtt([])
                            }}>비우기{" ("+docAtt.length+")"}</Button>
                        </Stack>
                    </Paper>
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <div style={{width:'100%',display:'flex'}}>
                                <Autocomplete
                                value={valAttFiled}
                                onChange={(event, newValue) => {
                                setValAttFiled({abb:newValue.split(" : ")[0], att_name : newValue.split(" : ")[1]});
                                }}
                                disablePortal
                                size="small"
                                id="valAttList"
                                options={valAttList.map((option) => option.abb + " : " + option.att_name)}
                                sx={{ flexGrow:1, marginRight:'10px'}}
                                renderInput={(params) => <TextField {...params} color="primary" label="밸리데이션 평가 성격 추가" />}
                                />
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                                    <Button size="small" variant="contained" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_VALATT",0)==-1)} onClick={()=>{
                                        if(valAttFiled){
                                            let tempArr = [...valAtt]

                                            let dupAbbCheck=false
                                            tempArr.map((oneItem,i)=>{
                                                if(oneItem.abb==valAttFiled.abb) dupAbbCheck=true
                                            })
                                            if(!dupAbbCheck) tempArr.push(valAttFiled)

                                            setValAtt(tempArr)
                                            LoginCheck()
                                        }
                                    }}>추가</Button>
                                </div>
                            </div>
                            <div style={{width:'100%', height:'294px', overflowY:'auto', boxSizing:'border-box'}}>
                                <List>
                                    {
                                        valAtt.map((oneAtt,i)=>{
                                            return(
                                                <ListItem
                                                style={{ width: "100%" }}
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_VALATT",0)==-1)} onClick={()=>{
                                                        let temp = [...valAtt]
                                                        temp.splice(i,1)
                                                        setValAtt(temp)
                                                    }}>
                                                    <DeleteIcon />
                                                    </IconButton>
                                                }
                                                >
                                                <ListItemIcon>
                                                    <SettingsApplicationsIcon color='primary'/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={oneAtt.abb}
                                                    secondary={oneAtt.att_name}
                                                />
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                            <Button size="small" variant="contained" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_VALATT",0)==-1)} onClick={()=>{
                                setValAtt([])
                            }}>비우기{" ("+valAtt.length+")"}</Button>
                        </Stack>
                    </Paper>
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <div style={{width:'100%',display:'flex'}}>
                                <Autocomplete
                                value={qualAttFiled}
                                onChange={(event, newValue) => {
                                setQualAttFiled({abb:newValue.split(" : ")[0], att_name : newValue.split(" : ")[1]});
                                }}
                                disablePortal
                                size="small"
                                id="qualAttList"
                                options={qualAttList.map((option) => option.abb + " : " + option.att_name)}
                                sx={{ flexGrow:1, marginRight:'10px'}}
                                renderInput={(params) => <TextField {...params} color="primary" label="적격성 평가 성격 추가" />}
                                />
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                                    <Button size="small" variant="contained" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_QUALATT",0)==-1)} onClick={()=>{
                                        if(qualAttFiled){
                                            let tempArr = [...qualAtt]

                                            let dupAbbCheck=false
                                            tempArr.map((oneItem,i)=>{
                                                if(oneItem.abb==qualAttFiled.abb) dupAbbCheck=true
                                            })
                                            if(!dupAbbCheck) tempArr.push(qualAttFiled)

                                            setQualAtt(tempArr)
                                            LoginCheck()
                                        }
                                    }}>추가</Button>
                                </div>
                            </div>
                            <div style={{width:'100%', height:'294px', overflowY:'auto', boxSizing:'border-box'}}>
                                <List>
                                    {
                                        qualAtt.map((oneAtt,i)=>{
                                            return(
                                                <ListItem
                                                style={{ width: "100%" }}
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_QUALATT",0)==-1)} onClick={()=>{
                                                        let temp = [...qualAtt]
                                                        temp.splice(i,1)
                                                        setQualAtt(temp)
                                                    }}>
                                                    <DeleteIcon />
                                                    </IconButton>
                                                }
                                                >
                                                <ListItemIcon>
                                                    <SettingsApplicationsIcon color='primary'/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={oneAtt.abb}
                                                    secondary={oneAtt.att_name}
                                                />
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                            <Button size="small" variant="contained" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_QUALATT",0)==-1)} onClick={()=>{
                                setQualAtt([])
                            }}>비우기{" ("+qualAtt.length+")"}</Button>
                        </Stack>
                    </Paper>
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <Button size="small" variant="contained" startIcon={<PrecisionManufacturingIcon/>} disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_EQATT",0)==-1)} onClick={()=>{
                            setPopUpPage(1)
                            setModalTitle("설비선택")
                            handleModalOpen()
                            LoginCheck()
                            }}>설비선택</Button>
                            <div style={{width:'100%', height:'300px', overflowY:'auto', boxSizing:'border-box'}}>
                                <List>
                                    {
                                        rdx.selTmmsWholeAsset.map((oneAtt,i)=>{
                                            return(
                                                <ListItem
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_EQATT",0)==-1)} onClick={()=>{
                                                    let temp = [...rdx.selTmmsWholeAsset]
                                                    temp.splice(i,1)
                                                    dispatch(setSelTmmsWholeAsset(temp))
                                                    }}>
                                                    <DeleteIcon />
                                                    </IconButton>
                                                }
                                                >
                                                <ListItemIcon>
                                                    <SettingsApplicationsIcon color='primary'/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={oneAtt.eq_code}
                                                    secondary={oneAtt.eq_code_alt+" / "+oneAtt.eq_name}
                                                />
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                            <Button size="small" variant="contained" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_EQATT",0)==-1)} onClick={()=>{
                                dispatch(setSelTmmsWholeAsset([]))
                            }}>비우기{" ("+rdx.selTmmsWholeAsset.length+")"}</Button>
                        </Stack>
                    </Paper>
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <Button size="small" variant="contained" startIcon={<WhereToVoteIcon/>} disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_LOCATT",0)==-1)} onClick={()=>{
                                setPopUpPage(6)
                                setModalTitle("관련 위치 선택")
                                handleModalOpen()
                                LoginCheck()
                                }}>관련 위치 선택</Button>
                            <div style={{width:'100%', height:'300px', overflowY:'auto', boxSizing:'border-box'}}>
                                <List>
                                    {
                                        rdx.selTmmsLocation.map((oneAtt,i)=>{
                                            return(
                                                <ListItem
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_LOCATT",0)==-1)} onClick={()=>{
                                                        console.log(rdx.selTmmsLocation[i])
                                                        let temp = [...rdx.selTmmsLocation]
                                                        temp.splice(i,1)
                                                        dispatch(setSelTmmsLocation(temp))
                                                    }}>
                                                    <DeleteIcon />
                                                    </IconButton>
                                                }
                                                >
                                                <ListItemIcon>
                                                    <SettingsApplicationsIcon color='primary'/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={oneAtt.location_code}
                                                    secondary={oneAtt.location_name}
                                                />
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                            <Button size="small" variant="contained" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_LOCATT",0)==-1)} onClick={()=>{
                                dispatch(setSelTmmsLocation([]))
                            }}>비우기{" ("+rdx.selTmmsLocation.length+")"}</Button>
                        </Stack>
                    </Paper>
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <Button size="small" variant="contained" startIcon={<VaccinesIcon/>} disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_PRODATT",0)==-1)} onClick={()=>{
                                setPopUpPage(2)
                                setModalTitle("제품선택")
                                handleModalOpen()
                                LoginCheck()
                                }}>제품선택</Button>
                            <div style={{width:'100%', height:'300px', overflowY:'auto', boxSizing:'border-box'}}>
                                <List>
                                    {
                                        rdx.selSapZmmr1010.map((oneAtt,i)=>{
                                            return(
                                                <ListItem
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_PRODATT",0)==-1)} onClick={()=>{
                                                        console.log(rdx.selSapZmmr1010[i])
                                                        let temp = [...rdx.selSapZmmr1010]
                                                        temp.splice(i,1)
                                                        dispatch(setSelSapZmmr1010(temp))
                                                    }}>
                                                    <DeleteIcon />
                                                    </IconButton>
                                                }
                                                >
                                                <ListItemIcon>
                                                    <SettingsApplicationsIcon color='primary'/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={oneAtt.mat_code}
                                                    secondary={oneAtt.mat_name}
                                                />
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                            <Button size="small" variant="contained" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_PRODATT",0)==-1)} onClick={()=>{
                                dispatch(setSelSapZmmr1010([]))
                            }}>비우기{" ("+rdx.selSapZmmr1010.length+")"}</Button>
                        </Stack>
                    </Paper>
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <Button size="small" variant="contained" startIcon={<ViewModuleIcon/>} disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_EQMSATT",0)==-1)} onClick={()=>{
                                setPopUpPage(3)
                                setModalTitle("eQMS 모듈 선택")
                                handleModalOpen()
                                LoginCheck()
                                }}>eQMS 모듈 선택</Button>
                            <div style={{width:'100%', height:'300px', overflowY:'auto', boxSizing:'border-box'}}>
                                <List>
                                    {
                                        rdx.selEqmsAtemplate.map((oneAtt,i)=>{
                                            return(
                                                <ListItem
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_EQMSATT",0)==-1)} onClick={()=>{
                                                        console.log(rdx.selEqmsAtemplate[i])
                                                        let temp = [...rdx.selEqmsAtemplate]
                                                        temp.splice(i,1)
                                                        dispatch(setSelEqmsAtemplate(temp))
                                                    }}>
                                                    <DeleteIcon />
                                                    </IconButton>
                                                }
                                                >
                                                <ListItemIcon>
                                                    <SettingsApplicationsIcon color='primary'/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={oneAtt.pr_no}
                                                    secondary={oneAtt.project + " / " + oneAtt.pr_title}
                                                />
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                            <Button size="small" variant="contained" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_EQMSATT",0)==-1)} onClick={()=>{
                                dispatch(setSelEqmsAtemplate([]))
                            }}>비우기{" ("+rdx.selEqmsAtemplate.length+")"}</Button>
                        </Stack>
                    </Paper>
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <Button size="small" variant="contained" startIcon={<InsertDriveFileIcon/>} disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_RELATEDDOC",0)==-1)} onClick={()=>{
                                setPopUpPage(5)
                                setModalTitle("관련문서 선택")
                                handleModalOpen()
                                LoginCheck()
                                }}>관련문서 선택</Button>
                            <div style={{width:'100%', height:'300px', overflowY:'auto', boxSizing:'border-box'}}>
                                <List>
                                    {
                                        rdx.sel_doc.map((oneAtt,i)=>{
                                            return(
                                                <ListItem
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_RELATEDDOC",0)==-1)} onClick={()=>{
                                                        console.log(rdx.sel_doc[i])
                                                        let temp = [...rdx.sel_doc]
                                                        temp.splice(i,1)
                                                        dispatch(setSel_doc(temp))
                                                    }}>
                                                    <DeleteIcon />
                                                    </IconButton>
                                                }
                                                >
                                                <ListItemIcon>
                                                    <SettingsApplicationsIcon color='primary'/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={oneAtt.doc_no + "(" + oneAtt.rev_no + ")"}
                                                    secondary={oneAtt.doc_title}
                                                />
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                            <Button size="small" variant="contained" disabled={(cookies.load('userInfo').user_auth.indexOf("MNG_DOC_BT_RELATEDDOC",0)==-1)} onClick={()=>{
                                dispatch(setSel_doc([]))
                            }}>비우기{" ("+rdx.sel_doc.length+")"}</Button>
                        </Stack>
                    </Paper>
                </div>
                <div style={{height:'48px'}}/>
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding:'10px' }} elevation={6}>
                    <div style={{width:'100%', display:'flex', alignItems:'center', backdropFilter:'blur(10px)'}}>
                        <PostAddIcon color="primary"/>
                        <Typography variant="BUTTON" component="div" sx={{ flexGrow: 1, overflow:'hidden', marginLeft:'4px' }}>{(targetRowObj=="N/A")?"문서정보 추가":"문서정보 수정"}</Typography>
                        <Button size="small" variant="contained" type="submit" form="postAddDoc" disabled={isSubmitting}>Submit</Button>
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
                    popUpPage==0?<MngTable getUrlStr={'/adddoc_getmngdocno'} targetPk={{}} heightValue={'72vh'} tblCtrl={true} chkSel={false} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                    popUpPage==1?<MngTable getUrlStr={'/adddoc_getextdatatmmswholeasset'} targetPk={{}} heightValue={'72vh'} tblCtrl={true} chkSel={true} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                    popUpPage==2?<MngTable getUrlStr={'/adddoc_getextdatasapzmmr1010'} targetPk={{}} heightValue={'72vh'} tblCtrl={true} chkSel={true} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                    popUpPage==3?<MngTable getUrlStr={'/adddoc_getextdataeqmsatemplate'} targetPk={{}} heightValue={'72vh'} tblCtrl={true} chkSel={true} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                    popUpPage==4?<MngTable getUrlStr={'/getgroupwareuser'} targetPk={{}} heightValue={'72vh'} tblCtrl={true} chkSel={false} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                    popUpPage==5?<MngTable getUrlStr={'/adddoc_getmngdoc'} targetPk={{}} heightValue={'72vh'} tblCtrl={true} chkSel={true} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                    popUpPage==6?<MngTable getUrlStr={'/adddoc_getextdatatmmslocation'} targetPk={{}} heightValue={'72vh'} tblCtrl={true} chkSel={true} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                    <div></div>
                }                    
                </div>
            </Paper>
        </Modal>
      </div>
  );
}

export default AddDoc