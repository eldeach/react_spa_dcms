//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import {PropTypes, TextField, Box, Typography,IconButton, Chip, Button, Stack, Paper,Divider,Modal, ListItemIcon, ListItemText, ListItem, List } from '@mui/material/';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import AddIcon from '@mui/icons-material/Add';
import RuleIcon from '@mui/icons-material/Rule';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
//========================================================== Formik & Yup 라이브러리 import
import { Formik } from 'formik';
import * as yup from 'yup';
//========================================================== axios 라이브러리 import
import axios from 'axios';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setSel_tb_user, setSel_doc_pattern, setLoginExpireTime } from "../store.js"
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './../Account/LoginSessionCheck.js';
//========================================================== MngTable 컴포넌트 import
import MngTable from './../MngTable/MngTable'
import { border } from '@mui/system';


function AddDocNo() {

  //========================================================== [변수, 객체 선언] 선택된 정보 redux 저장용
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();
  //========================================================== useNaviagte 선언
  let navigate = useNavigate()

  //========================================================== [변수, 객체 선언][테이블] DataGrid Table 작동 state 정의
  let [pageSize, setPageSize] = useState(20);
  let [rowHtAuto,setRowHtAuto] = useState(true);
  let [cols,setCols] = useState([]); // Material UI Col 정의 State
  let [rows,setRows] = useState([]); // Material UI Row 정의 State
  //========================================================== Form 작동 Satae 정의 정의
  let [isSubmitting, setIsSubmitting] = useState(false); // Submit 중복 클릭 방지
  let [isResetting, setIsResetting] = useState(false); // Reset 중복 클릭 방지
  let [isPatternConfirming, setIsPatternConfirming] = useState(false); // pattern Confirm 중복 클릭 방지
  let [uniquePatternCheck,setUniquePatternCheck] = useState(false); // pattern 유일성 점검을 한적이 있는지 체크
  let [uniquePattern,setUniquePattern] = useState(false); // pattern 유일성이 확보되어 있는지 체크
  let [isPatternNameConfirming, setIsPatternNameConfirming] = useState(false); // pattern_name Confirm 중복 클릭 방지
  let [uniquePatternNameCheck,setUniquePatternNameCheck] = useState(false); // pattern_name 유일성 점검을 한적이 있는지 체크
  let [uniquePatternName,setUniquePatternName] = useState(false); // pattern_name 유일성이 확보되어 있는지 체크
  let [popUpPage,setPopUpPage] = useState(0);
  let [manDocNo,setManDocNo]=useState();

  //========================================================== Formik & yup Validation schema
  const schema = yup.object().shape({
    req_purpose: yup.string()
    .required('문서번호를 발번하는 사유를 입력해주세요.')
  });

  //========================================================== useEffect 코드
  useEffect(() => {
    // 이 페이지의 권한 유무 확인
    authCheck()
    //유저 선택 redux 초기화


    //값 초기화
    if(targetRowObj=="N/A"){
      dispatch(setSel_tb_user({}))
      dispatch(setSel_doc_pattern([]))
    }
    else{
      dispatch(setSel_tb_user({user_account:targetRowObj.req_user, user_name:targetRowObj.user_name, user_team:targetRowObj.req_team }))
      dispatch(setSel_doc_pattern([{pattern_name: targetRowObj.used_pattern_name, doc_no_pattern:targetRowObj.used_pattern}]))
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

  function authCheck(){
    if(cookies.load('loginStat')){
      if(cookies.load('userInfo').user_auth.indexOf("ADD_DOC_NO",0)!=-1){

      }
      else{
          alert("ADD_DOC_NO 권한이 없습니다.")
          navigate('/')
      }

    }
    else{
        alert("로그인 상태가 아닙니다.")
        navigate('/')
    }
  }

  async function postAddDocNo(qryBody){
    let ajaxData = await axios.post("/postAddDocNo",qryBody)
    .then((res)=>res.data)
    .catch((err)=>{
      console.log(err)
    })

    if(ajaxData.success) return ajaxData.result
    else alert(ajaxData)
    
  }

  async function putEditDocNo(qryBody){
    let ajaxData = await axios.put("/puteditdocno",qryBody)
    .then((res)=>res.data)
    .catch((err)=>{
      console.log(err)
    })

    if(ajaxData.success) return ajaxData.result
    else alert(ajaxData)
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

    let [refresh,setRefresh] = useState(false);

  return (
    <div style={{padding:'0.5vw'}}>
        <Formik
          validationSchema={schema}
          onSubmit={async (values, {resetForm})=>{
            setIsSubmitting(true);           
            if(rdx.sel_doc_pattern.length>0 && rdx.sel_tb_user.user_account.length>0 ){
              if(targetRowObj=="N/A"){
                let qryBody = {
                  pattenrs:rdx.sel_doc_pattern,
                  req_purpose:values.req_purpose,
                  req_user:rdx.sel_tb_user.user_account,
                  req_team:rdx.sel_tb_user.user_team,
                  remark:values.remark,                
                  insert_by:cookies.load('userInfo').user_account
                }
                let ajaxData = await postAddDocNo(qryBody)
                console.log(ajaxData)
              }
              else{
                let qryBody = {
                  doc_no:targetRowObj.doc_no,
                  pattenrs:rdx.sel_doc_pattern,
                  req_purpose:values.req_purpose,
                  req_user:rdx.sel_tb_user.user_account,
                  req_team:rdx.sel_tb_user.user_team,
                  remark:values.remark,                
                  update_by:cookies.load('userInfo').user_account,
                  uuid_binary:targetRowObj.uuid_binary
                }
                let ajaxData = await putEditDocNo(qryBody)
                console.log(ajaxData)
              }

            }
            else{
              alert("요청자와 문서번호 패턴이 선택되어야 합니다.")
            }

            resetForm()
            dispatch(setSel_tb_user({}))
            dispatch(setSel_doc_pattern([]))
            
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
            req_purpose : '',  
            remark: ''
          }:{
            req_purpose : targetRowObj.req_purpose,  
            remark: targetRowObj.remark
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
          id="addDocPatternPostForm"
          component="form"
          sx={{ width: '100vw', display: 'flex', flexWrap: 'wrap',justifyContent:'center'}}
          noValidate
          onSubmit={handleSubmit}
          autoComplete="off"
          >
            <div style={{width:'100%', display:'flex', flexWrap:'wrap', justifyContent:'center'}}>
              <Paper className="seperate-paper" elevation={3}>
                <Stack spacing={2}>
                  <Button size="small" variant="contained" onClick={()=>{
                  setPopUpPage(0) 
                  setModalTitle("요창자 선택")
                  handleModalOpen()
                  setRefresh(false)
                  LoginCheck()
                  }}>요청자 선택</Button>
                  <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                    <Chip label="요청자" color="primary"/>
                    <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center'}}><div>{rdx.sel_tb_user.user_account}</div></div>
                  </Stack>
                  <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                    <Chip label="요청자명" color="primary"/>
                    <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center'}}><div>{rdx.sel_tb_user.user_name}</div></div>
                  </Stack>
                  <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                    <Chip label="요청팀" color="primary"/>
                    <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center'}}><div>{rdx.sel_tb_user.user_team}</div></div>
                  </Stack>
                  <TextField
                    required
                    variant="outlined"
                    id="req_purpose"
                    name="req_purpose"
                    label="발번 목적"
                    multiline
                    rows={2}
                    value={values.req_purpose}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.req_purpose ? errors.req_purpose : ""}
                    error={touched.req_purpose && Boolean(errors.req_purpose)}
                    margin="dense"
                    fullWidth
                  />
                  <TextField
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
                    <Button disabled={!(targetRowObj=="N/A")} size="small" variant="contained" onClick={()=>{
                    setPopUpPage(1)
                    setModalTitle("문서번호 패턴 선택")
                    handleModalOpen()
                    LoginCheck()
                    }}>문서번호 패턴 선택</Button>
                    <div style={{width:'100%', height:'300px', overflowY:'auto', boxSizing:'border-box'}}>
                        <List>
                            {
                              rdx.sel_doc_pattern.map((oneAtt,i)=>{
                                console.log(oneAtt)
                                let secondaryStr
                                if(targetRowObj=="N/A"){
                                  secondaryStr="패턴: "+oneAtt.doc_no_pattern
                                }
                                else{
                                  secondaryStr = "문서번호 : " + targetRowObj.doc_no
                                }
                               
                                  return(
                                      <ListItem
                                      secondaryAction={
                                          <IconButton disabled={!(targetRowObj=="N/A")} edge="end" aria-label="delete" onClick={()=>{
                                          let temp = [...rdx.sel_doc_pattern]
                                          temp.splice(i,1)
                                          dispatch(setSel_doc_pattern(temp))
                                          }}>
                                          <DeleteIcon />
                                          </IconButton>
                                      }
                                      >
                                      <ListItemIcon>
                                        <RuleIcon color='primary'/>
                                      </ListItemIcon>
                                      <ListItemText
                                          primary={oneAtt.pattern_name}
                                          secondary={secondaryStr}
                                      />
                                      </ListItem>
                                    )
                                })
                            }
                        </List>
                    </div>
                    <Button disabled={!(targetRowObj=="N/A")} size="small" variant="contained" onClick={()=>{
                        dispatch(setSel_doc_pattern([]))
                    }}>비우기{" ("+rdx.sel_doc_pattern.length+")"}</Button>
                </Stack>
              </Paper>
            </div>
          <div style={{height:'48px'}}/>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding:'10px' }} elevation={6}>
                <div style={{width:'100%', display:'flex', alignItems:'center', backdropFilter:'blur(10px)'}}>
                    <AddIcon color="primary"/>
                    <Typography variant="BUTTON" component="div" sx={{ flexGrow: 1, overflow:'hidden', marginLeft:'4px' }}>{(targetRowObj=="N/A")?"문서번호 추가":"발번정보 수정"}</Typography>
                    <Button size="small" variant="contained" type="submit" form="addDocPatternPostForm" disabled={isSubmitting}>Submit</Button>
                    <Button style={{marginLeft:'1vw'}} size="small" variant="contained" onClick={async ()=>{
                    LoginCheck()
                    navigate(-1)
                    }}>Cancel</Button>
                </div>
            </Paper>
          </Box>
        )}
        </Formik>
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
                <div style={{display:'block', height:'550px', overflow:"auto"}}>
                  {
                    popUpPage==0?<MngTable getUrlStr={'/edituserauth_getuser'} targetPk={{}} heightValue={480} tblCtrl={true} chkSel={false} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                    popUpPage==1?<MngTable getUrlStr={'/adddocno_getmngdocnopattern'} targetPk={{}} heightValue={480} tblCtrl={true} chkSel={true} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                    <div></div>
                  }
                </div>
              </div>
            </Paper>
          </Modal>
      </div>     
  );
}

export default AddDocNo