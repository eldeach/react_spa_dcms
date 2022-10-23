//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import {PropTypes, Autocomplete, TextField, Box, Typography,IconButton, Chip, Button, Stack, Paper,Divider,Modal, ListItemIcon, ListItemText, ListItem, List } from '@mui/material/';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import LockResetIcon from '@mui/icons-material/LockReset';
//========================================================== Formik & Yup 라이브러리 import
import { Formik } from 'formik';
import * as yup from 'yup';
//========================================================== axios 라이브러리 import
import axios from 'axios';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setLoginExpireTime } from "../store.js"
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './../Account/LoginSessionCheck.js';
//========================================================== MngTable 컴포넌트 import
import MngTable from './../MngTable/MngTable'

function ModifyUser() {
  async function handleCopyClipBoard (text){
    try {
      await navigator.clipboard.writeText(text);
      alert('클립보드에 재발행된 비밀번호가 복사되었습니다.');
    } catch (e) {
      alert('복사에 실패하였습니다');
    }
};

  //========================================================== [변수, 객체 선언] 선택된 정보 redux 저장용
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();
  //========================================================== useNaviagte 선언
  let navigate = useNavigate()

  //========================================================== Form 작동 Satae 정의 정의
  let [isSubmitting, setIsSubmitting] = useState(false); // Submit 중복 클릭 방지
  let [popUpPage,setPopUpPage] = useState(0);

  const userAuthList = [
    {abb:"MNG_USER_INFO",att_name:"Manage User Information"},
    {abb:"VIEW_USER_INFO",att_name:"View User Information"},
    {abb:"MODIFY_USER_INFO",att_name:"Modify User Information"},
    {abb:"EXT_DATA",att_name:"Upload Exteranl Data"},
    {abb:"ADD_EDIT_BINDER",att_name:"Add or Edit Binder Information"},
    {abb:"MNG_BINDER_MOVE_HISTORY",att_name:"Manage Binder History of Moving"},
    {abb:"VIEW_BINDER_MOVE_HISTORY",att_name:"View Binder History of Moving"},
    {abb:"IMPORT_BINDER",att_name:"Import Binder"},
    {abb:"EXPORT_BINDER",att_name:"Export Binder"},
    {abb:"MNG_BINDER_INFO",att_name:"Manage Binder Information"},
    {abb:"VIEW_BINDER_INFO",att_name:"View Binder Information"},
    {abb:"MNG_DOC_INFO",att_name:"Manage Documents Information"},
    {abb:"MNG_DOC_BT_DOCATT",att_name:"Manage Attribute of Document"},
    {abb:"MNG_DOC_BT_VALATT",att_name:"Management of Validation Documents"},
    {abb:"MNG_DOC_BT_QUALATT",att_name:"Management of Qualification Documents"},
    {abb:"MNG_DOC_BT_EQATT",att_name:"Management of Documents regarding Equipment"},
    {abb:"MNG_DOC_BT_LOCATT",att_name:"Management of Documents regarding Location"},
    {abb:"MNG_DOC_BT_PRODATT",att_name:"Management of Product or Material in Document"},
    {abb:"MNG_DOC_BT_EQMSATT",att_name:"Management of eQMS in the Document"},
    {abb:"MNG_DOC_BT_RELATEDDOC",att_name:"Management of Related Documents"},
    {abb:"VIEW_DOC_INFO",att_name:"View Documents Information"},
    {abb:"VIEW_AUDIT_TRAIL",att_name:"View Audit Trail"},
    {abb:"CFG_BINDER_LOC",att_name:"Configure Binder Location"},
    
  ]
  let [userAuthField,setUserAuthField]=useState();
  let [userAuth, setUserAuth] = useState([])

  const userStatList=[
    {abb:"LockNoUse",att_name:"Lock Not Using Account"},
    {abb:"LockPw",att_name:"Lock by PW Incorrect"}
  ]
  let [userStatField,setUserStatField]=useState();
  let [userStat, setUserStat] = useState([])

  let [rndPw,setRndPw]=useState('');

  //========================================================== Formik & yup Validation schema
  const schema = yup.object().shape({

  });

  //========================================================== useEffect 코드
  useEffect(() => {
    // 이 페이지의 권한 유무 확인
    authCheck()
    //유저 선택 redux 초기화


    //값 초기화
    setUserAuth(JSON.parse(targetRowObj.user_auth))
    setUserStat(JSON.parse(targetRowObj.account_status))
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
      if(cookies.load('userInfo').user_auth.indexOf("MODIFY_USER_INFO",0)!=-1){

      }
      else{
          alert("MODIFY_USER_INFO 권한이 없습니다.")
          navigate('/')
      }

    }
    else{
        alert("로그인 상태가 아닙니다.")
        navigate('/')
    }
  }

  async function putEditUserInfo(qryBody){
    let ajaxData = await axios.put("/putedituserinfo",qryBody)
    .then((res)=>res.data)
    .catch((err)=>{
      console.log(err)
    })

    if(ajaxData.success) return ajaxData.result
    else alert(ajaxData)
  }

  async function putResetPw(qryBody){
    let ajaxData = await axios.put("resetaccountpw",qryBody)
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
            console.log(targetRowObj.user_account)
            setIsSubmitting(true);           
            let qryBody = {
            user_account:targetRowObj.user_account,
            user_auth:JSON.stringify(userAuth),
            account_status: JSON.stringify(userStat),
            remark:values.remark,              
            update_by:cookies.load('userInfo').user_account,
            }
            let ajaxData = await putEditUserInfo(qryBody)
            console.log(ajaxData)

            resetForm()
            
            setIsSubmitting(false);
            LoginCheck()
            navigate(-1)
        }}
        initialValues={{
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
        id="modifyUserForm"
        component="form"
        sx={{ width: '100vw', display: 'flex', flexWrap: 'wrap',justifyContent:'center'}}
        noValidate
        onSubmit={handleSubmit}
        autoComplete="off"
        >
          <div style={{width:'100%', display:'flex', flexWrap:'wrap', justifyContent:'center'}}>
            <Paper className="seperate-paper" elevation={3}>
              <Stack spacing={2}>
                <Chip label="계정 정보" color="primary"/>
                <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                    <div style={{wdith:'80px', minWidth:'80px', display:'flex', justifyContent:'center', alignItems:'center'}}><Chip style={{width:'80px', minWidth:'80px'}} size="small" label="계정" color="primary"/></div>
                    <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center', overflowY:"auto"}}><Typography>{targetRowObj.user_account}</Typography></div>
                </Stack>
                <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                    <div style={{wdith:'80px', minWidth:'80px', display:'flex', justifyContent:'center', alignItems:'center'}}><Chip style={{width:'80px', minWidth:'80px'}} size="small" label="사용자명" color="primary"/></div>
                    <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center', overflowY:"auto"}}><Typography>{targetRowObj.user_name}</Typography></div>
                </Stack>
                <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                    <div style={{wdith:'80px', minWidth:'80px', display:'flex', justifyContent:'center', alignItems:'center'}}><Chip style={{width:'80px', minWidth:'80px'}} size="small" label="직책" color="primary"/></div>
                    <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center', overflowY:"auto"}}><Typography>{targetRowObj.user_position}</Typography></div>
                </Stack>
                <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                    <div style={{wdith:'80px', minWidth:'80px', display:'flex', justifyContent:'center', alignItems:'center'}}><Chip style={{width:'80px', minWidth:'80px'}} size="small" label="팀" color="primary"/></div>
                    <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center', overflowY:"auto"}}><Typography>{targetRowObj.user_team}</Typography></div>
                </Stack>
                <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                    <div style={{wdith:'80px', minWidth:'80px', display:'flex', justifyContent:'center', alignItems:'center'}}><Chip style={{width:'80px', minWidth:'80px'}} size="small" label="회사" color="primary"/></div>
                    <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center', overflowY:"auto"}}><Typography>{targetRowObj.user_company}</Typography></div>
                </Stack>
                <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                    <div style={{wdith:'80px', minWidth:'80px', display:'flex', justifyContent:'center', alignItems:'center'}}><Chip style={{width:'80px', minWidth:'80px'}} size="small" label="이메일" color="primary"/></div>
                    <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center', overflowY:"auto"}}><Typography>{targetRowObj.user_email}</Typography></div>
                </Stack>
                <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                    <div style={{wdith:'80px', minWidth:'80px', display:'flex', justifyContent:'center', alignItems:'center'}}><Chip style={{width:'80px', minWidth:'80px'}} size="small" label="전화번호" color="primary"/></div>
                    <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center', overflowY:"auto"}}><Typography>{targetRowObj.user_phone}</Typography></div>
                </Stack>
                <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                    <div style={{wdith:'80px', minWidth:'80px', display:'flex', justifyContent:'center', alignItems:'center'}}><Chip style={{width:'80px', minWidth:'80px'}} size="small" label="UUID" color="primary"/></div>
                    <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center', overflowY:"auto"}}><Typography>{targetRowObj.uuid_binary}</Typography></div>
                </Stack>
              </Stack>
            </Paper>
            <Paper className="seperate-paper" elevation={3}>
              <Stack spacing={2}>
                <Chip label="비고" color="primary"/>
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
                <Button size="small" variant="contained" onClick={()=>{
                  let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                  let passwordLength = 8;
                  let password=""
                  for (var i = 0; i <= passwordLength; i++) {
                    var randomNumber = Math.floor(Math.random() * chars.length);
                    password += chars.substring(randomNumber, randomNumber +1);
                   }
                   setRndPw(password)
                  let qryBody={
                    user_account : targetRowObj.user_account,
                    user_pw : password,
                    uuid_binary : targetRowObj.uuid_binary,
                    reset_by:cookies.load('userInfo').user_account
                  }
                  putResetPw(qryBody)
                }}>비밀번호 초기화</Button>
                {
                  rndPw!=''?
                  <div style={{width:'100%',display:'flex',alignItems:'center'}}>
                    <Chip sx={{ flexGrow:1, marginRight:'10px'}} size="small" label={rndPw} icon={<LockResetIcon/>} color="confirm"/>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <Button size="small" variant="contained" onClick={()=>{
                            handleCopyClipBoard(rndPw)
                        }}>복사</Button>
                    </div>
                  </div>
                  :<div></div>
                }
                {
                  rndPw!=''?
                  <Typography variant='caption'>위 초기화된 비밀번호를 사용자에게 알려주세요.</Typography>
                  :<div></div>
                }
              </Stack>
            </Paper>
            <Paper className="seperate-paper" elevation={3}>
                <Stack spacing={2}>
                    <div style={{width:'100%',display:'flex'}}>
                        <Autocomplete
                        value={userAuthField}
                        onChange={(event, newValue) => {
                        setUserAuthField({abb:newValue.split(" : ")[0], att_name : newValue.split(" : ")[1]});
                        }}
                        disablePortal
                        size="small"
                        id="userAuth"
                        options={userAuthList.map((option) => option.abb + " : " + option.att_name)}
                        sx={{ flexGrow:1, marginRight:'10px'}}
                        renderInput={(params) => <TextField {...params} color="primary" label="사용자 권한 추가" />}
                        />
                        <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <Button size="small" variant="contained" onClick={()=>{
                                if(userAuthField){
                                    let tempArr = [...userAuth]
                                    let dupAbbCheck=false
                                    tempArr.map((oneItem,i)=>{
                                        if(oneItem.abb==userAuthField.abb) dupAbbCheck=true
                                    })
                                    if(!dupAbbCheck) tempArr.push(userAuthField)
                                    setUserAuth(tempArr)
                                    LoginCheck()
                                }
                            }}>추가</Button>
                        </div>
                    </div>
                    <div style={{width:'100%', height:'300px', overflowY:'auto', boxSizing:'border-box'}}>
                        <List>
                            {
                                userAuth.map((oneAtt,i)=>{
                                    return(
                                        <ListItem
                                        style={{ width: "100%" }}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete" onClick={()=>{
                                                let temp = [...userAuth]
                                                temp.splice(i,1)
                                                setUserAuth(temp)
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
                    <Button size="small" variant="contained" onClick={()=>{
                                setUserAuth([])
                            }}>비우기{" ("+userAuth.length+")"}</Button>
                </Stack>
            </Paper>
            <Paper className="seperate-paper" elevation={3}>
                <Stack spacing={2}>
                    <div style={{width:'100%',display:'flex'}}>
                        <Autocomplete
                        value={userStatField}
                        onChange={(event, newValue) => {
                        setUserStatField({abb:newValue.split(" : ")[0], att_name : newValue.split(" : ")[1]});
                        }}
                        disablePortal
                        size="small"
                        id="userStat"
                        options={userStatList.map((option) => option.abb + " : " + option.att_name)}
                        sx={{ flexGrow:1, marginRight:'10px'}}
                        renderInput={(params) => <TextField {...params} color="primary" label="계정 상태 추가" />}
                        />
                        <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <Button size="small" variant="contained" onClick={()=>{
                                if(userStatField){
                                    let tempArr = [...userStat]
                                    let dupAbbCheck=false
                                    tempArr.map((oneItem,i)=>{
                                        if(oneItem.abb==userStatField.abb) dupAbbCheck=true
                                    })
                                    if(!dupAbbCheck) tempArr.push(userStatField)
                                    setUserStat(tempArr)
                                    LoginCheck()
                                }
                            }}>추가</Button>
                        </div>
                    </div>
                    <div style={{width:'100%', height:'300px', overflowY:'auto', boxSizing:'border-box'}}>
                        <List>
                            {
                                userStat.map((oneAtt,i)=>{
                                    return(
                                        <ListItem
                                        style={{ width: "100%" }}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete" onClick={()=>{
                                                let temp = [...userStat]
                                                temp.splice(i,1)
                                                setUserStat(temp)
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
                    <Button size="small" variant="contained" onClick={()=>{
                                setUserStat([])
                            }}>비우기{" ("+userStat.length+")"}</Button>
                </Stack>
            </Paper>
          </div>
        <div style={{height:'48px'}}/>
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding:'10px' }} elevation={6}>
              <div style={{width:'100%', display:'flex', alignItems:'center', backdropFilter:'blur(10px)'}}>
                  <AddIcon color="primary"/>
                  <Typography variant="BUTTON" component="div" sx={{ flexGrow: 1, overflow:'hidden', marginLeft:'4px' }}>{"계정 속성 수정"}</Typography>
                  <Button size="small" variant="contained" type="submit" form="modifyUserForm" disabled={isSubmitting}>Submit</Button>
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

export default ModifyUser