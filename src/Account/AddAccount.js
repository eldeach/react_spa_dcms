//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
//========================================================== Formik & Yup 라이브러리 import
import { Formik } from 'formik';
import * as yup from 'yup';
//========================================================== axios 라이브러리 import
import axios from 'axios';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setLoginExpireTime } from "./../store.js"
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './LoginSessionCheck.js';


function AddAccount() {
  //========================================================== [변수, 객체 선언] 선택된 정보 redux 저장용
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();
  //========================================================== useNaviagte 선언
  let navigate = useNavigate()

  //========================================================== Form 작동 Satae 정의 정의
  let [isSubmitting, setIsSubmitting] = useState(false); // Submit 중복 클릭 방지
  let [isResetting, setIsResetting] = useState(false); // Reset 중복 클릭 방지
  let [isIdConfirming, setIsIdConfirming] = useState(false); // Id Confirm 중복 클릭 방지
  let [uniqueIdCheck,setUniqueIdCheck] = useState(false); // user_account 유일성 점검을 한적이 있는지 체크
  let [uniqueId,setUniqueId] = useState(false); // user_account 유일성이 확보되어 있는지 체크

  //========================================================== Formik & yup Validation schema
  const schema = yup.object().shape({

    user_account: yup.string()
    .required('계정을 입력해주세요.')
    .test(
        'useraccount_blank_check',
        "공백은 없어야 합니다.",
        function(value){
            if(typeof(value)=="string"){
                return !value.includes(" ")
            }
        }
    )
    .test(
        'is_unique_useraccount',
        '계정 중복체크가 필요합니다.',
        (value, context) => uniqueIdCheck
    )
    .test(
      'not_dup_useraccount',
      '중복된 계정입니다.',
      (value, context) => uniqueId
    ),
    user_pw: yup.string()
    .required('비밀번호를 입력해주세요.')
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
    user_pw_check: yup.string()
    .required('비밀번호를 재입력해주세요.')
    .oneOf([yup.ref('user_pw'), null], '재입력한 비밀번호는 일치해야합니다.'),
    user_name: yup.string().required('사용자명을 입력해주세요.'),
    user_team : yup.string().required('팀명을 입력해주세요.'),
    user_email: yup.string().required('이메일을 입력해주세요.').email("올바르지 않은 이메일 형식입니다."),
    user_phone: yup.string().matches(
        /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/,
        "유효하지 않은 전화번호입니다."
      )
  });

  //========================================================== useEffect 코드
  useEffect(() => {
    // 이 페이지의 권한 유무 확인
    authCheck()
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
      if(cookies.load('userInfo').user_auth.indexOf("ADD_ACCOUNT",0)!=-1){

      }
      else{
          alert("ADD_ACCOUNT 권한이 없습니다.")
          navigate('/')
      }

    }
    else{
        alert("로그인 상태가 아닙니다.")
        navigate('/')
    }
  }

  async function formPost(qryBody){
    let ajaxData = await axios.post("/postaddaccount",qryBody)
    .then((res)=>res.data)
    .catch((err)=>{
      console.log(err)
    })

    if(ajaxData.success) return ajaxData.result
    else alert(ajaxData)
    
  }

  return (
      <div className="content-middle" style={{paddingBottom:'40px'}}>
        <Formik
          validationSchema={schema}
          onSubmit={async (values, {resetForm})=>{
            let qryBody = {
              user_account: values.user_account,
              user_pw:values.user_pw,
              user_name:values.user_name,
              user_position:values.user_position,
              user_team:values.user_team,
              user_company:values.user_company,
              user_email:values.user_email,
              user_phone:values.user_phone,
              remark: values.remark,
              insert_by:cookies.load('userInfo').user_account
            }
            setIsSubmitting(true);
            await formPost(qryBody)
            resetForm()
            setIsSubmitting(false);
            LoginCheck()
          }}
          initialValues={{
            user_account: '',
            user_pw:'',
            user_pw_check:'',
            user_name:'',
            user_position:'',
            user_team:'',
            user_company:'',
            user_email:'',
            user_phone:'',
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
            <div style={{fontSize: "100px"}}><AccountCircleIcon fontSize ="inherit" color="primary"/></div>
            <div style={{fontSize: "40px"}}>Add Account</div>
            <div style={{height: "20px"}}></div>
            <Stack spacing={2}>
              <Box
              id="postform"
              component="form"
              sx={{ width: 500, display: 'flex', flexWrap: 'wrap' }}
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

                <Button variant="outlined" disabled={isIdConfirming} onClick={async ()=>{
                  setUniqueIdCheck(true)
                  setIsIdConfirming(uniqueId=>true)

                  let body={
                    user_account : values.user_account
                  }

                  let ajaxData=await axios.post('/duplicatedaccountCheck',body)
                  .then((res)=>res.data)
                  .catch((err)=>err)
                  
                  if(ajaxData.success){
                    if(ajaxData.result.length<1) setUniqueId(uniqueId=>true)
                    else setUniqueId(uniqueId=>false)
                  }
                  else{
                    alert(ajaxData.result)
                  }
                  await new Promise((r) => setTimeout(r, 1000));
                  validateField('user_account')
                  setIsIdConfirming(uniqueId=>false)
                  LoginCheck()
                }}>Confirm</Button>

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

                <TextField
                  required
                  variant="standard"
                  id="user_pw_check"
                  name="user_pw_check"
                  label="Password Check"
                  type="password"
                  value={values.user_pw_check}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.user_pw_check ? errors.user_pw_check : ""}
                  error={touched.user_pw_check && Boolean(errors.user_pw_check)}
                  margin="dense"
                  fullWidth
                />

                <TextField
                  required
                  variant="standard"
                  id="user_name"
                  name="user_name"
                  label="User Name"
                  // type="text"
                  value={values.user_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.user_name ? errors.user_name : ""}
                  error={touched.user_name && Boolean(errors.user_name)}
                  margin="dense"
                  fullWidth
                />
                <TextField
                  variant="standard"
                  id="user_position"
                  name="user_position"
                  label="Position"
                  // type="text"
                  value={values.user_position}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.user_position ? errors.user_position : ""}
                  error={touched.user_position && Boolean(errors.user_position)}
                  margin="dense"
                  fullWidth
                />

                <TextField
                  required
                  variant="standard"
                  id="user_team"
                  name="user_team"
                  label="Team"
                  // type="text"
                  value={values.user_team}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.user_team ? errors.user_team : ""}
                  error={touched.user_team && Boolean(errors.user_team)}
                  margin="dense"
                  fullWidth
                />

                <TextField
                  required
                  variant="standard"
                  id="user_company"
                  name="user_company"
                  label="Company"
                  // type="text"
                  value={values.user_company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.user_company ? errors.user_company : ""}
                  error={touched.user_company && Boolean(errors.user_company)}
                  margin="dense"
                  fullWidth
                />

                <TextField
                  required
                  variant="standard"
                  id="user_email"
                  name="user_email"
                  label="E-Mail"
                  // type="email"
                  value={values.user_email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.user_email ? errors.user_email : ""}
                  error={touched.user_email && Boolean(errors.user_email)}
                  margin="dense"
                  fullWidth
                />
                <TextField
                  variant="standard"
                  id="user_phone"
                  name="user_phone"
                  label="Phone Number"
                  // type="tel"
                  value={values.user_phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.user_phone ? errors.user_phone : ""}
                  error={touched.user_phone && Boolean(errors.user_phone)}
                  margin="dense"
                  fullWidth
                />

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
              </Box>
              <div className='content-middle'>
                <Stack spacing={2} direction="row">
                  <Button variant="contained" type="submit" form="postform" disabled={isSubmitting}>Submit</Button>
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
  );
}

export default AddAccount