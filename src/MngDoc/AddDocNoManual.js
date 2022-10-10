//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import {PropTypes, TextField, Box, Typography,IconButton, Chip, Button, Stack, Paper,Divider,Modal, ListItemIcon, ListItemText, ListItem, List } from '@mui/material/';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import AddIcon from '@mui/icons-material/Add';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import DeleteIcon from '@mui/icons-material/Delete';
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

function AddDocNoManual() {

  //========================================================== [변수, 객체 선언] 선택된 정보 redux 저장용
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();
  //========================================================== useNaviagte 선언
  let navigate = useNavigate()

  //========================================================== Form 작동 Satae 정의 정의
  let [isSubmitting, setIsSubmitting] = useState(false); // Submit 중복 클릭 방지
  let [popUpPage,setPopUpPage] = useState(0);
  let [manDocNo,setManDocNo]=useState('');
  let manDocNohandleChange = (event) => {setManDocNo(event.target.value.replace(" ",""))}
  let [manDocNoList,setManDocNoList] = useState([])

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
    }
    else{
      dispatch(setSel_tb_user({user_account:targetRowObj.req_user, user_name:targetRowObj.user_name, user_team:targetRowObj.req_team }))
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

  async function postAddDocNoManual(qryBody){
    let ajaxData = await axios.post("/postadddocnomanual",qryBody)
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
          if(manDocNoList.length>0 && !(!rdx.sel_tb_user.user_account) ){
            let qryBody = {
              docNos:manDocNoList,
              req_purpose:values.req_purpose,
              req_user:rdx.sel_tb_user.user_account,
              req_team:rdx.sel_tb_user.user_team,
              remark:values.remark,                
              insert_by:cookies.load('userInfo').user_account
            }
            let ajaxData = await postAddDocNoManual(qryBody)
            console.log(ajaxData)
          }
          else{
            alert("요청자 선택과 문서번호(수동)가 추가되어야 합니다.")
          }

          resetForm()
          dispatch(setSel_tb_user({}))
          setManDocNoList([])
          
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
                  <div style={{wdith:'80px', minWidth:'80px', display:'flex', justifyContent:'center', alignItems:'center'}}><Chip style={{width:'80px', minWidth:'80px'}} size="small" label="요청자" color="primary"/></div>
                  <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center', overflowY:"auto"}}><Typography>{rdx.sel_tb_user.user_account}</Typography></div>
                </Stack>
                <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                  <div style={{wdith:'80px', minWidth:'80px', display:'flex', justifyContent:'center', alignItems:'center'}}><Chip style={{width:'80px', minWidth:'80px'}} size="small" label="요청자명" color="primary"/></div>
                  <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center', overflowY:"auto"}}><Typography>{rdx.sel_tb_user.user_name}</Typography></div>
                </Stack>
                <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                  <div style={{wdith:'80px', minWidth:'80px', display:'flex', justifyContent:'center', alignItems:'center'}}><Chip style={{width:'80px', minWidth:'80px'}} size="small" label="요청팀" color="primary"/></div>
                  <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center', overflowY:"auto"}}><Typography>{rdx.sel_tb_user.user_team}</Typography></div>
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
                  <div style={{width:'100%',display:'flex'}}>
                    <TextField
                    size="small"
                    variant="outlined"
                    id="manualDocNo"
                    name="manualDocNo"
                    label="수동 문서번호 입력"
                    value={manDocNo}
                    sx={{ flexGrow:1, marginRight:'10px'}}
                    onChange={manDocNohandleChange}
                    margin="dense"
                    fullWidth
                    />
                      <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <Button size="small" variant="contained" onClick={async ()=>{
                            let dupCheckResult = await axios.post('/dupcheckdocnomanual',{doc_no:manDocNo})
                            console.log(dupCheckResult)
                            if(dupCheckResult.data.result.length<1){
                              if(manDocNo){
                                let tempArr = [...manDocNoList]

                                let dupAbbCheck=false
                                tempArr.map((oneItem,i)=>{
                                    if(oneItem==manDocNo) dupAbbCheck=true
                                })
                                if(!dupAbbCheck) tempArr.push(manDocNo)

                                setManDocNoList(tempArr)
                                LoginCheck()
                              }
                            }
                            else{
                              alert("해당 번호는 이미 발번된 번호입니다.")
                            }

                          }}>추가</Button>
                      </div>
                  </div>
                  <div style={{width:'100%', height:'290px', overflowY:'auto', boxSizing:'border-box'}}>
                      <List>
                          {
                              manDocNoList.map((oneDocNo,i)=>{
                                  return(
                                      <ListItem
                                      style={{ width: "100%" }}
                                      secondaryAction={
                                          <IconButton edge="end" aria-label="delete" onClick={()=>{
                                              let temp = [...manDocNoList]
                                              temp.splice(i,1)
                                              setManDocNoList(temp)
                                          }}>
                                          <DeleteIcon />
                                          </IconButton>
                                      }
                                      >
                                      <ListItemIcon>
                                          <SettingsApplicationsIcon color='primary'/>
                                      </ListItemIcon>
                                      <ListItemText
                                          primary={oneDocNo}
                                      />
                                      </ListItem>
                                  )
                              })
                          }
                      </List>
                  </div>
                  <Button size="small" variant="contained" onClick={()=>{
                      setManDocNoList([])
                  }}>비우기{" ("+manDocNoList.length+")"}</Button>
              </Stack>
          </Paper>
          </div>
        <div style={{height:'48px'}}/>
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding:'10px' }} elevation={6}>
              <div style={{width:'100%', display:'flex', alignItems:'center', backdropFilter:'blur(10px)'}}>
                  <AddIcon color="primary"/>
                  <Typography variant="BUTTON" component="div" sx={{ flexGrow: 1, overflow:'hidden', marginLeft:'4px' }}>{"수동으로 문서번호 추가"}</Typography>
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
                  popUpPage==0?<MngTable getUrlStr={'/getgroupwareuser'} targetPk={{}} heightValue={480} tblCtrl={true} chkSel={false} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
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

export default AddDocNoManual