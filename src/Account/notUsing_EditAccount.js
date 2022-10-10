//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useNavigate, useLocation } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
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


function EditAccount() {
  //========================================================== [변수, 객체 선언] 선택된 정보 redux 저장용
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();
  //========================================================== useNaviagte 선언
  let navigate = useNavigate()

  //========================================================== Form 작동 Satae 정의 정의
  let [isSubmitting, setIsSubmitting] = useState(false); // Submit 중복 클릭 방지
  let [isResetting, setIsResetting] = useState(false); // Reset 중복 클릭 방지
  //let [isIdConfirming, setIsIdConfirming] = useState(false); // Id Confirm 중복 클릭 방지 disabled={true} //[ADD form에서 생략][PK관련] PK열은 수정지원 안 함
  //let [uniqueIdCheck,setUniqueIdCheck] = useState(false); // user_account 유일성 점검을 한적이 있는지 체크 //[ADD form에서 생략][PK관련] PK열은 수정지원 안 함
  //let [uniqueId,setUniqueId] = useState(false); // user_account 유일성이 확보되어 있는지 체크 //[ADD form에서 생략][PK관련] PK열은 수정지원 안 함

  //========================================================== Formik & yup Validation schema
  const schema = yup.object().shape({
    user_name: yup.string().required('사용자명을 입력해주세요.'),
    user_team : yup.string().required('팀명을 입력해주세요.'),
    user_email: yup.string().required('이메일을 입력해주세요.').email("올바르지 않은 이메일 형식입니다."),
    user_phone: yup.string().matches(
        /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/,
        "유효하지 않은 전화번호입니다."
      )
  });

  //========================================================== [ADD form에서 추가] 수정할 row Oject state 넘겨받기 위한 코드
  const location = useLocation();
  const targetRowObj= (!location.state ? "N/A" : location.state.rowObj)
  console.log(location.state.rowObj)

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
      if(cookies.load('userInfo').user_auth.indexOf("MNG_ACCOUNT",0)!=-1){

      }
      else{
          alert("MNG_ACCOUNT 권한이 없습니다.")
          navigate('/')
      }

    }
    else{
        alert("로그인 상태가 아닙니다.")
        navigate('/')
    }
  }

  async function formPut(qryBody){ //[ADD form에서 변경][AJAX 타입 변경] POST에서 PUT AJAX로 변경
    let ajaxData = await axios.put("/putediteaccount",qryBody)
    .then((res)=>res.data)
    .catch((err)=>err)

    if(ajaxData.success) return ajaxData.result
    else alert(ajaxData)
  }

  return (
      <div className="content-middle" style={{paddingBottom:'40px'}}>
        <Formik
          validationSchema={schema}
          onSubmit={async (values, {resetForm})=>{
            let qryBody = {
              user_account:values.user_account,
              user_name:values.user_name,
              user_position:values.user_position,
              user_team:values.user_team,
              user_company:values.user_company,
              user_email:values.user_email,
              user_phone:values.user_phone,
              remark: values.remark,
              update_by:cookies.load('userInfo').user_account,
              uuid_binary:values.uuid_binary
            }
            setIsSubmitting(true);
            await formPut(qryBody)
            resetForm()
            setIsSubmitting(false);
            LoginCheck()
            navigate('/mngaccount')
          }}
          initialValues={{
            user_account: targetRowObj.user_account,
            user_pw:'',
            user_name:targetRowObj.user_name,
            user_position:targetRowObj.user_position,
            user_team:targetRowObj.user_team,
            user_company:targetRowObj.user_company,
            user_email:targetRowObj.user_email,
            user_phone:targetRowObj.user_phone,
            remark: targetRowObj.remark,
            uuid_binary:targetRowObj.uuid_binary
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
            <div style={{fontSize: "100px"}}><ManageAccountsIcon fontSize ="inherit" color="primary"/></div>
            <div style={{fontSize: "40px"}}>Edit Account</div>
            <div style={{height: "20px"}}></div>
            <Stack spacing={2}>
              <Box
              id="posteditform"
              component="form"
              sx={{ width: 500, display: 'flex', flexWrap: 'wrap' }}
              noValidate
              onSubmit={handleSubmit}
              autoComplete="off"
              >
                <TextField
                  required
                  disabled={true}
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
                  value={values.user_pw}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.user_pw ? errors.user_pw : ""}
                  error={touched.user_pw && Boolean(errors.user_pw)}
                  margin="dense"
                  fullWidth
                />

                <Button variant="outlined" onClick={async ()=>{
                  if(!values.user_pw.includes(" ")&&!values.user_pw.length==0){
                    let ajaxData = await axios.put("/resetaccountpw",{user_pw:values.user_pw,uuid_binary:values.uuid_binary,user_account:values.user_account, reset_by:cookies.load("userInfo").user_account})
                    .then((res)=>{return res.data})
                    .catch((err)=>err)
                    if(ajaxData.success) alert("비밀번호가 변경되었습니다.")
                    else {
                      alert("비밀번호가 변경에 문제가 생겼습니다. ("+ ajaxData.result+")")
                    }
                    navigate('/mngaccount')
                  }
                  else{
                    alert("Password는 공백이 없어야 합니다.")
                  }
                  LoginCheck()
                  }}>Reset</Button> 

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
                <TextField //[ADD form에서 추가] UPDATE할 Row 검색용 UUID 추가
                  variant="standard"
                  disabled={true}
                  id="uuid_binary"
                  name="uuid_binary"
                  label="UUID"
                  value={values.uuid_binary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.uuid_binary ? errors.uuid_binary : ""}
                  error={touched.uuid_binary && Boolean(errors.uuid_binary)}
                  margin="dense"
                  fullWidth
                />
              </Box>
              <div className='content-middle'>
                <Stack spacing={2} direction="row">
                  <Button variant="contained" type="submit" form="posteditform" disabled={isSubmitting}>Submit</Button>
                  <Button variant="outlined" type="reset" disabled={isResetting} onClick={async ()=>{
                    setIsResetting(true)
                    resetForm()
                    setIsResetting(false)
                    LoginCheck()
                    }}>Reset</Button>
                  <Button variant="outlined" onClick={()=>{
                    LoginCheck()
                    navigate(-1)
                  }}>Cancel</Button>
                </Stack>
              </div>
            </Stack>
          </div>
        )}
        </Formik>
      </div>     
  );
}

export default EditAccount