
//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import {PropTypes, Tabs, Tab, Typography, Box, Chip, Button, Stack, Paper,Divider, TextField, Modal, Checkbox, ListItemIcon, ListItemText, ListItem, CardHeader, Card, List, Grid} from '@mui/material/';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockResetIcon from '@mui/icons-material/LockReset';
//========================================================== Formik & Yup 라이브러리 import
import { Formik } from 'formik';
import * as yup from 'yup';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setLoginExpireTime } from "./../store.js"
//========================================================== axios 라이브러리 import
import axios from 'axios';
//========================================================== MngTable 컴포넌트 import
import MngTable from './../MngTable/MngTable'
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './LoginSessionCheck.js';
//========================================================== 반응형 웹
import { BrowserView, MobileView } from 'react-device-detect';

function MyPage() {
    //========================================================== Form 작동 Satae 정의 정의
    let [isSubmitting, setIsSubmitting] = useState(false); // Submit 중복 클릭 방지
    let [isResetting, setIsResetting] = useState(false); // Reset 중복 클릭 방지

  //========================================================== Formik & yup Validation schema
  const changePwSchema = yup.object().shape({
    before_user_pw: yup.string()
    .required('현재 비밀번호를 입력해주세요.'),
    after_user_pw: yup.string()
    .required('변결할 비밀번호를 입력해주세요.')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "패스워드는 최소 한개의 대문자, 소문자, 숫자 및 특수문자가 포함되어야 하며 8자리 이상이어야 합니다."
    )
    .test(
        'useraccount_blank_check',
        "공백은 없어야 합니다.",
        function(value){
            if(typeof(value)=="string"){
                return !value.includes(" ")
            }
        }
    ),
    after_user_pw_check: yup.string()
    .required('변경할 비밀번호를 재입력해주세요.')
    .oneOf([yup.ref('after_user_pw'), null], '재입력한 비밀번호는 일치해야합니다.')
  });
  //========================================================== [Tab] Tab 관련 함수 및 state 정의
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 1 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  //========================================================== [변수, 객체 선언][useNaviagte]
  let navigate = useNavigate()

  //========================================================== SlidePopup 작동 redux state 관련 선언
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();

  //========================================================== [MyInfo] 현재값 조회 state 및 함수 선언
  let [initMyInfo,setInitMyInfo]=useState({})
  async function myInfo(){
    if(cookies.load('loginStat')){
    let ajaxData = await axios({
      method:"get",
      url:"/getmypage",
      params:{user_account:cookies.load("userInfo").user_account},
      headers:{
          'Content-Type':'application/json'
      }})
      .then((res)=>{
        setInitMyInfo(res.data.result[0])
        return res.data
      })
      .catch((err)=>console.log(err))
    // get URL 및 params 가변 코드 라인 끝
    
    if(!ajaxData.success) alert("내 정보 조회를 실패했습니다.")
    }
  }


  //========================================================== [변수, 객체 선언][useEffect]
  useEffect(() => {
    // 이 페이지의 권한 유무 확인
    authCheck()
    // 내 정보 현재값 조회
    myInfo()
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

  //========================================================== [함수][권한] 권한 점검
  function authCheck(){
    if(cookies.load('loginStat')){

    }
    else{
        alert("로그인 상태가 아닙니다.")
        navigate('/')
    }
  }

  async function formPut(qryBody){
    let ajaxData = await axios.put("/changepwself",qryBody)
    .then((res)=>res.data)
    .catch((err)=>{
      console.log(err)
    })
    return ajaxData
  }



  return (
    <Stack style={{padding:'10px'}} direction='row' spacing={2}>
      <Paper style={{width:'25%', padding:'20px', marginLeft:'10px',marginRight:'10px', minHeight:'650px', overflowY:'auto', boxSizing:'border-box'}} elevation={3}>
        <Stack spacing={2}>
          <div style={{display:'flex', alignContent:'center'}}>
            <div style={{fontSize:"3.2vw"}}>
              <AccountCircleIcon fontSize ="inherit" color="primary"/>
            </div>
            <div style={{display:'block',  width:"70%", alignContent:'center',paddingLeft:'1vw'}}>
              <div className="fontbig">{initMyInfo.user_name}</div>
              <div className="fontnormal">{initMyInfo.user_account}</div>
            </div>
          </div>
          <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
            <div className='info-item'>직책</div>
            <div className='info-item-content'>{initMyInfo.user_position}</div>
          </Stack>
          <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
            <div className='info-item'>팀</div>
            <div className='info-item-content'>{initMyInfo.user_team}</div>
          </Stack>
          <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
            <div className='info-item'>회사</div>
            <div className='info-item-content'>{initMyInfo.user_company}</div>
          </Stack>
          <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
            <div className='info-item'>E-Mail</div>
            <div className='info-item-content'>{initMyInfo.user_email}</div>
          </Stack>
          <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
            <div className='info-item'>전화</div>
            <div className='info-item-content'>{initMyInfo.user_phone}</div>
          </Stack>
          <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
            <div className='info-item'>비고</div>
            <div className='info-item-content'>{initMyInfo.remark}</div>
          </Stack>
          <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
            <div className='info-item'>UUID</div>
            <div className='info-item-content'>{initMyInfo.uuid_binary}</div>
          </Stack>
        </Stack>
      </Paper>
      <Paper style={{width:'75%', padding:'20px', marginLeft:'10px',marginRight:'10px', minHeight:'650px', overflowY:'auto', boxSizing:'border-box'}} elevation={3}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="My Page Tabs">
              <Tab icon={<LockResetIcon/>} label="비밀번호 변경" {...a11yProps(0)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <div className="content-middle" >
              <Formik
                validationSchema={changePwSchema}
                onSubmit={async (values, {resetForm})=>{
                  let qryBody = {
                    before_user_pw:values.before_user_pw,
                    after_user_pw:values.after_user_pw,
                    user_account:initMyInfo.user_account,
                    update_by:cookies.load('userInfo').user_account
                  }
                  setIsSubmitting(true);
                  let ajaxResult=await formPut(qryBody)
                  if(ajaxResult.success){
                    alert("비밀번호가 변경되었습니다.")
                  }
                  else{
                    alert(ajaxResult.result)
                  }
                  resetForm()
                  setIsSubmitting(false);
                  LoginCheck()
                }}
                initialValues={{
                  before_user_pw:'',
                  after_user_pw:'',
                  after_user_pw_check:'',
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
                  <Stack spacing={2}>
                    <Box
                    id="chagePwForm"
                    component="form"
                    sx={{ width: '100%', display: 'flex', flexWrap: 'wrap',justifyContent:'center' }}
                    noValidate
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    >
                      <div style={{width:'40vw',display:'block'}}>
                        <TextField
                          required
                          variant="standard"
                          id="before_user_pw"
                          type="password"
                          name="before_user_pw"
                          label="Current Password"
                          value={values.before_user_pw}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={touched.before_user_pw ? errors.before_user_pw: ""}
                          error={touched.before_user_pw && Boolean(errors.before_user_pw)}
                          margin="dense"
                          fullWidth
                        />
                        <TextField
                          required
                          variant="standard"
                          id="after_user_pw"
                          type="password"
                          name="after_user_pw"
                          label="New Password"
                          value={values.after_user_pw}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={touched.after_user_pw ? errors.after_user_pw : ""}
                          error={touched.after_user_pw && Boolean(errors.after_user_pw)}
                          margin="dense"
                          fullWidth
                        />
                        <TextField
                          required
                          variant="standard"
                          id="after_user_pw_check"
                          type="password"
                          name="after_user_pw_check"
                          label="New Password Check"
                          value={values.after_user_pw_check}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={touched.after_user_pw_check ? errors.after_user_pw_check : ""}
                          error={touched.after_user_pw_check && Boolean(errors.after_user_pw_check)}
                          margin="dense"
                          fullWidth
                        />
                      </div>
                    </Box>
                    <div className='content-middle'>
                      <Stack spacing={2} direction="row">
                        <Button variant="contained" type="submit" form="chagePwForm" disabled={isSubmitting}>Submit</Button>
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
            </div>
          </TabPanel>
        </Box>
      </Paper>
    </Stack>
  );
}

export default MyPage