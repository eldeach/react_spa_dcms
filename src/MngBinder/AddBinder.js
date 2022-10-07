
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
//========================================================== Moment 라이브러리 import
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
//========================================================== QRCode 라이브러리 import
import { QRCode } from 'react-qrcode-logo';
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

function AddBinder() {
      //========================================================== Formik & yup Validation schema
  const schema = yup.object().shape({
    binder_title: yup.string()
    .required('바인더제목을 입력해주세요.')
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

  //========================================================== [변수, 객체 선언][useEffect]
  useEffect(() => {
    // 이 페이지의 권한 유무 확인
    authCheck()

    //값 초기화
    if(targetRowObj=="N/A"){
        dispatch(setSel_doc([]))
    }
    else{
        dispatch(setSel_doc(JSON.parse(targetRowObj.relateddoc)))
    }

  },[]);
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

  async function postAddBinder(qryBody){
    let ajaxData = await axios.post("/postaddbinder",qryBody)
    .then((res)=>res.data)
    .catch((err)=>{
      console.log(err)
    })

    if(ajaxData.success) return ajaxData.result
    else alert(ajaxData)
  }

  async function putEditBinder(qryBody){
    let ajaxData = await axios.put("/puteditbinder",qryBody)
    .then((res)=>res.data)
    .catch((err)=>{
      console.log(err)
    })

    if(ajaxData.success) return ajaxData.result
    else console.log(ajaxData)
  }

  return (
    <div style={{padding:'0.5vw'}}>
        <Formik
        validationSchema={schema}
        onSubmit={async (values, {resetForm})=>{
            setIsSubmitting(true);
            console.log(values.binder_title)
            if(targetRowObj=="N/A"){
                let qryBody = {
                    binder_title:values.binder_title,
                    relateddoc: JSON.stringify(rdx.sel_doc),
                    binder_year:values.binder_year,
                    mng_team:values.mng_team,
                    binder_loc:values.binder_loc,
                    relateddoc: JSON.stringify(rdx.sel_doc),
                    binder_keyword:values.binder_keyword,
                    remark:values.remark,
                    insert_by:cookies.load('userInfo').user_account
                }
                
                let ajaxData = await postAddBinder(qryBody)
                console.log(ajaxData)
            }
            else{
                let qryBody = {
                    binder_title:values.binder_title,
                    relateddoc: JSON.stringify(rdx.sel_doc),
                    binder_year:values.binder_year,
                    mng_team:values.mng_team,
                    binder_loc:values.binder_loc,
                    relateddoc: JSON.stringify(rdx.sel_doc),
                    binder_keyword:values.binder_keyword,
                    remark:values.remark,
                    update_by:cookies.load('userInfo').user_account,
                    uuid_binary:targetRowObj.uuid_binary
                }
                let ajaxData = await putEditBinder(qryBody)
                console.log(ajaxData)
            }


            resetForm()
            dispatch(setSel_doc([]))

            setIsSubmitting(false);
            LoginCheck()

            if(targetRowObj=="N/A"){

            }
            else
            {
                navigate(-1)
            }
        }}
        initialValues={!location.state ?{
            binder_keyword:'OPBND',
            binder_title:'',
            binder_year:'',
            mng_team:'',
            binder_loc:'',
            remark:''
        }:{
            binder_keyword:targetRowObj.binder_keyword,
            binder_title:targetRowObj.binder_title,
            binder_year:targetRowObj.binder_year,
            mng_team:targetRowObj.mng_team,
            binder_loc:targetRowObj.binder_loc,
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
            noValidate
            onSubmit={handleSubmit}
            autoComplete="off"
            >
                <div style={{width:'100%', display:'flex', flexWrap:'wrap', justifyContent:'center'}}>
                    {
                        !location.state ?
                        <div></div>
                        :
                        <Paper className="seperate-paper" elevation={3}>
                            <Stack style={{textAlign:'center'}} spacing={2}>
                                <Chip label="바인더 번호" color="primary"/>
                                <div style={{height:'30px'}}/>
                                <div><QRCode value={targetRowObj.binder_no} logoImage="public/logo192.png" fgColor="#2196f3"/></div>
                                <Typography variant="subtitle1">{targetRowObj.binder_no}</Typography>
                            </Stack>
                        </Paper>
                    }
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <Chip label="바인더 정의" color="primary"/>
                            <TextField
                            required
                            dislabled={true}
                            variant="standard"
                            id="binder_keyword"
                            name="binder_keyword"
                            label="바인더 키워드"
                            value={values.binder_keyword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={touched.binder_keyword ? errors.binder_keyword : ""}
                            error={touched.binder_keyword && Boolean(errors.binder_keyword)}
                            margin="dense"
                            fullWidth
                            />
                            <TextField
                            required
                            variant="outlined"
                            id="binder_title"
                            name="binder_title"
                            label="바인더 제목"
                            multiline
                            rows={4}
                            value={values.binder_title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={touched.binder_title ? errors.binder_title : ""}
                            error={touched.binder_title && Boolean(errors.binder_title)}
                            margin="dense"
                            fullWidth
                            />
                        </Stack>
                    </Paper>
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <Button size="small" variant="contained" onClick={()=>{
                                setPopUpPage(0)
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
                                                    <IconButton edge="end" aria-label="delete" onClick={()=>{
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
                            <Button size="small" variant="contained" onClick={()=>{
                                dispatch(setSel_doc([]))
                            }}>비우기{" ("+rdx.sel_doc.length+")"}</Button>
                        </Stack>
                    </Paper>
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <Chip label="바인더 관리 정보" color="primary"/>
                            <TextField
                            required
                            variant="outlined"
                            id="binder_year"
                            name="binder_year"
                            label="발행년도"
                            value={values.binder_year}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={touched.binder_year ? errors.binder_year : ""}
                            error={touched.binder_year && Boolean(errors.binder_year)}
                            margin="dense"
                            fullWidth
                            />
                            <TextField
                            required
                            variant="outlined"
                            id="mng_team"
                            name="mng_team"
                            label="관리부서"
                            value={values.mng_team}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={touched.mng_team ? errors.mng_team : ""}
                            error={touched.mng_team && Boolean(errors.mng_team)}
                            margin="dense"
                            fullWidth
                            />
                            <TextField
                            required
                            variant="outlined"
                            id="binder_loc"
                            name="binder_loc"
                            label="바인더 위치"
                            value={values.binder_loc}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={touched.binder_loc ? errors.binder_loc : ""}
                            error={touched.binder_loc && Boolean(errors.binder_loc)}
                            margin="dense"
                            fullWidth
                            />
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
                </div>
                <div style={{height:'48px'}}/>
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding:'10px' }} elevation={6}>
                    <div style={{width:'100%', display:'flex', alignItems:'center', backdropFilter:'blur(10px)'}}>
                        <PostAddIcon color="primary"/>
                        <Typography variant="BUTTON" component="div" sx={{ flexGrow: 1, overflow:'hidden', marginLeft:'4px' }}>{(targetRowObj=="N/A")?"바인더 정보 추가":"바인더 정보 수정"}</Typography>
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
                    popUpPage==0?<MngTable getUrlStr={'/adddoc_getmngdoc'} targetPk={{}} heightValue={'72vh'} tblCtrl={true} chkSel={true} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                    <div></div>
                }                    
                </div>
            </Paper>
        </Modal>
      </div>
  );
}

export default AddBinder