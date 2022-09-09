//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import {PropTypes, Tabs, Tab, TextField, Box, Typography, Chip, Button, Stack, Paper,Divider,Modal, Checkbox, ListItemIcon, ListItemText, ListItem, CardHeader, Card, List, Grid} from '@mui/material/';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Filter9PlusIcon from '@mui/icons-material/Filter9Plus';
//========================================================== Formik & Yup 라이브러리 import
import { Formik } from 'formik';
import * as yup from 'yup';
//========================================================== axios 라이브러리 import
import axios from 'axios';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setSel_tb_user, setLoginExpireTime } from "../store.js"
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

  //========================================================== Form 작동 Satae 정의 정의
  let [isSubmitting, setIsSubmitting] = useState(false); // Submit 중복 클릭 방지
  let [isResetting, setIsResetting] = useState(false); // Reset 중복 클릭 방지
  let [isPatternConfirming, setIsPatternConfirming] = useState(false); // pattern Confirm 중복 클릭 방지
  let [uniquePatternCheck,setUniquePatternCheck] = useState(false); // pattern 유일성 점검을 한적이 있는지 체크
  let [uniquePattern,setUniquePattern] = useState(false); // pattern 유일성이 확보되어 있는지 체크
  let [isPatternNameConfirming, setIsPatternNameConfirming] = useState(false); // pattern_name Confirm 중복 클릭 방지
  let [uniquePatternNameCheck,setUniquePatternNameCheck] = useState(false); // pattern_name 유일성 점검을 한적이 있는지 체크
  let [uniquePatternName,setUniquePatternName] = useState(false); // pattern_name 유일성이 확보되어 있는지 체크

  //========================================================== Formik & yup Validation schema
  const schema = yup.object().shape({
    req_purpose: yup.string()
    .required('이 패턴을 가진 문서가 제정 시 시작될 개정번호를 입력해주세요.')
  });

  //========================================================== useEffect 코드
  useEffect(() => {
    // 이 페이지의 권한 유무 확인
    authCheck()
    //유저 선택 redux 초기화
    dispatch(setSel_tb_user({}))
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

  async function postAddDoc(qryBody){
    let ajaxData = await axios.post("/postAddDocPattern",qryBody)
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
      <div className="content-middle" style={{paddingBottom:'40px'}}>
        <Formik
          validationSchema={schema}
          onSubmit={async (values, {resetForm})=>{
            let qryBody = {
                doc_no:values.doc_no,
                req_purpose:values.req_purpose,
                req_user:rdx.sel_tb_user.user_account,
                req_team:rdx.sel_tb_user.user_team,
                remark:values.remark,                
                insert_by:cookies.load('userInfo').user_account
            }
            setIsSubmitting(true);
            await postAddDoc(qryBody)
            resetForm()
            setIsSubmitting(false);
            LoginCheck()
          }}
          initialValues={{
            doc_no : '',   
            req_purpose : '',  
            remark: ''
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
          <div style={{alignItems:"center", textAlign:"center"}}>
            <div style={{height: "20px"}}></div>
            <div style={{fontSize: "100px"}}><Filter9PlusIcon fontSize ="inherit" color="primary"/></div>
            <div style={{fontSize: "40px"}}>Add Documnet Number</div>
            <div style={{height: "20px"}}></div>
            <Stack spacing={2}>
              <Box
              id="addDocPatternPostForm"
              component="form"
              sx={{ width: '100vw', display: 'flex', flexWrap: 'wrap',justifyContent:'center'}}
              noValidate
              onSubmit={handleSubmit}
              autoComplete="off"
              >
                <div style={{width:'35vw'}}>
                  <TextField
                    required
                    variant="standard"
                    id="doc_no"
                    name="doc_no"
                    label="Doc. No."
                    value={values.doc_no}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.doc_no ? errors.doc_no : ""}
                    error={touched.doc_no && Boolean(errors.doc_no)}
                    margin="dense"
                    fullWidth
                  />
                  <TextField
                    required
                    variant="standard"
                    id="req_purpose"
                    name="req_purpose"
                    label="발번 목적"
                    multiline
                    rows={4}
                    value={values.req_purpose}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.req_purpose ? errors.req_purpose : ""}
                    error={touched.req_purpose && Boolean(errors.req_purpose)}
                    margin="dense"
                    fullWidth
                  />
                <Paper style={{width:'100%', marginTop:'10px', display:'block', padding:'16px', boxSizing:'border-box'}} elevation={3}>
                    <Stack spacing={2}>
                        <div style={{display : 'flex'}}>
                            <AccountCircleIcon fontSize="large" color="primary"/>
                            <div style ={{flexGrow: 1 }}></div>
                                <Button size="small" variant="contained" onClick={()=>{
                                setModalTitle("요창자 선택")
                                handleModalOpen()
                                setRefresh(false)
                                LoginCheck()
                                }}>요청자 선택</Button>
                        </div>
                        <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                            <div className='select-item'>요청자</div>
                            <div className='select-item-content'>{rdx.sel_tb_user.user_account}</div>
                        </Stack>
                        <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                            <div className='select-item'>요청자명</div>
                            <div className='select-item-content'>{rdx.sel_tb_user.user_name}</div>
                        </Stack>
                        <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                            <div className='select-item'>팀</div>
                            <div className='select-item-content'>{rdx.sel_tb_user.user_team}</div>
                        </Stack>
                    </Stack>
                  </Paper>
                  <TextField
                    variant="standard"
                    id="remark"
                    name="remark"
                    label="Remark"
                    multiline
                    rows={4}
                    value={values.remark}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.remark ? errors.remark : ""}
                    error={touched.remark && Boolean(errors.remark)}
                    margin="dense"
                    fullWidth
                  />

                </div>
              </Box>
              <div className='content-middle'>
                <Stack spacing={2} direction="row">
                  <Button variant="contained" type="submit" form="addDocPatternPostForm" disabled={isSubmitting}>Submit</Button>
                  <Button variant="outlined" type="reset" disabled={isResetting} onClick={async ()=>{
                    setIsResetting(true)
                    resetForm()
                    setIsResetting(false)
                    LoginCheck()
                    }}>Reset</Button>
                </Stack>
              </div>
            </Stack>
          </div>
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
                  <MngTable getUrlStr={'/edituserauth_getuser'} targetPk={{}} heightValue={480} tblCtrl={true} chkSel={false} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>
                </div>
              </div>
            </Paper>
          </Modal>
      </div>     
  );
}

export default AddDocNo