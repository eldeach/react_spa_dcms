//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LockIcon from '@mui/icons-material/Lock';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
//========================================================== Formik & Yup 라이브러리 import
import { Formik } from 'formik';
import * as yup from 'yup';
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setLoginExpireTime } from "./../store.js"
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './LoginSessionCheck.js';


function UserLogin() {
  //========================================================== [Backdrop] 모달 열기/닫기 및 스타일 정의
  let [openBackDrop, setOpenBackDrop] = useState(false);
  //========================================================== [변수, 객체 선언] 선택된 정보 redux 저장용
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();
  //========================================================== useNaviagte 선언
  let navigate = useNavigate()

  //========================================================== Form 작동 Satae 정의 정의
  let [isSubmitting, setIsSubmitting] = useState(false); // Submit 중복 클릭 방지
  let [isResetting, setIsResetting] = useState(false); // Reset 중복 클릭 방지

  //========================================================== Formik & yup Validation schema
  const schema = yup.object().shape({

    user_account: yup.string()
    .required('계정을 입력해주세요.'),

    user_pw: yup.string()
    .required('비밀번호를 입력해주세요.')
  });

  //========================================================== useEffect 코드
  useEffect(() => {

  },[]);

  async function LoginCheck(qryBody){
    let checkResult = await LoginSessionCheck("init",qryBody)
    if(checkResult.expireTime==0){
      if(checkResult.flashMsg=="wrong PW"){
        dispatch(setLoginExpireTime(0))
        alert("비밀번호가 틀렸습니다.")
        navigate("/login")
      }
      else if(checkResult.flashMsg=="no user_account")
      {
        dispatch(setLoginExpireTime(0))
        alert("존재하지 않는 계정입니다.")
        navigate("/login")
      }
      else if(checkResult.flashMsg=="no auth")
      {
        dispatch(setLoginExpireTime(0))
        alert("이 계정은 권한이 없습니다.")
        navigate("/login")
      }
      navigate('/login')
    }
    else{
      dispatch(setLoginExpireTime(checkResult.expireTime))
      navigate("/")
    }
  }

  return (
      <div className="content-middle">
        <Formik
          validationSchema={schema}
          onSubmit={async (values, {resetForm})=>{
            setOpenBackDrop(true)
            let qryBody = {
              id: values.user_account,
              pw:values.user_pw
            }
            setIsSubmitting(true);
            await LoginCheck(qryBody)
            resetForm()
            setIsSubmitting(false);
            setOpenBackDrop(false)
          }}
          initialValues={{
            user_account: '',
            user_pw:'',
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
            <div style={{width:'48vw', minWidth : '300px', padding:'10px', margin:'1vw', overflowY:'auto', boxSizing:'border-box', alignItems:"center", textAlign:"center"}}>
                <div style={{height: "40px"}}></div>
                <div style={{fontSize: "100px"}}><LockIcon fontSize ="inherit" color="primary"/></div>
                <div style={{fontSize: "40px"}}>LOGIN</div>
                <div style={{height: "40px"}}></div>
                <Stack spacing={2}>
                    <Box
                    id="postform"
                    component="form"
                    // sx={{
                    //   '& .MuiTextField-root': { m: 1, width: '25ch' },
                    // }}
                    //
                    sx={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}
                    noValidate
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    >
                    <TextField
                    required
                    variant="standard"
                    id="user_account"
                    name="user_account"
                    label="User Account"
                    value={values.user_account}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.user_account ? errors.user_account : ""}
                    error={touched.user_account && Boolean(errors.user_account)}
                    margin="dense"
                    fullWidth
                    />

                    <TextField
                    required
                    variant="standard"
                    id="user_pw"
                    name="user_pw"
                    label="Password"
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
                    <div className='content-middle'>
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" type="submit" form="postform" disabled={isSubmitting}>Submit</Button>
                        <Button variant="outlined" type="reset" disabled={isResetting} onClick={async ()=>{
                        setIsResetting(true)
                        resetForm()
                        setIsResetting(false)
                        }}>Reset</Button>
                    </Stack>
                    </div>
                </Stack>
            </div>
        )}
        </Formik>
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackDrop}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      </div>     
  );
}

export default UserLogin