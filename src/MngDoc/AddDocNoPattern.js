//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import RuleIcon from '@mui/icons-material/Rule';
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


function AddDocNoPattern() {
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
  let [pos1st,setPos1st]=useState('');
  let [pos2nd,setPos2nd]=useState('');
  let [pos3rd,setPos3rd]=useState('');
  let [pos4th,setPos4th]=useState('');
  let [pos5th,setPos5th]=useState('');

  const patternCode = [
    {elementName:"-"},
    {elementName:"{2_year}"},
    {elementName:"{3_serial_per_year}"}
  ]

  //========================================================== Formik & yup Validation schema
  const schema = yup.object().shape({

    doc_no_pattern: yup.string()
    .required('패턴을 정의해주세요.')
    .test(
      'is_unique_pattern',
      '패턴 중복체크가 필요합니다.',
      (value, context) => uniquePatternCheck
    )
    .test(
      'not_dup_pattern',
      '중복된 패턴입니다.',
      (value, context) => uniquePattern
    )
    .test(
      'pattern_blank_check',
      "공백은 없어야 합니다.",
      function(value){
          if(typeof(value)=="string"){
              return !value.includes(" ")
          }
      }
    ),
    start_rev_no: yup.string()
    .required('이 패턴을 가진 문서가 제정 시 시작될 개정번호를 입력해주세요.')
    .matches(/^\d+$/, '숫자만 입력해주세요.'),
    ref_sop_no: yup.string()
    .required('패턴 절차의 근거가 되는 SOP 번호를 입력해주세요.'),
    ref_sop_rev: yup.string().required('패턴 절차의 근거가 되는 SOP의 개정번호를 입력해주세요.')
    .matches(/^\d+$/, '숫자만 입력해주세요.'),
    pattern_name : yup.string().required('이 패턴의 명칭을 정의해주세요.')
    .test(
      'is_unique_pattern_name',
      '패턴명 중복체크가 필요합니다.',
      (value, context) => uniquePatternNameCheck
    )
    .test(
      'not_dup_pattern_name',
      '중복된 패턴명입니다.',
      (value, context) => uniquePatternName
    ),
    pattern_description: yup.string().required('이 패턴에 대해 설명해주세요.'),
    serial_pool:yup.string()
    .test(
      'serial_pool_blank_check',
      "공백은 없어야 합니다. 공백대신 underscore(언더바, _ )를 제안합니다.",
      function(value){
          if(typeof(value)=="string"){
              return !value.includes(" ")
          }
      }
    ),
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
      if(cookies.load('userInfo').user_auth.indexOf("ADD_DOC_NO_PATTERN",0)!=-1){

      }
      else{
          alert("ADD_DOC_NO_PATTERN 권한이 없습니다.")
          navigate('/')
      }

    }
    else{
        alert("로그인 상태가 아닙니다.")
        navigate('/')
    }
  }

  async function postAddDocPattern(qryBody){
    let ajaxData = await axios.post("/postAddDocPattern",qryBody)
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
                doc_no_pattern:values.doc_no_pattern,
                start_rev_no:values.start_rev_no,
                ref_sop_no:values.ref_sop_no,
                ref_sop_rev:values.ref_sop_rev,
                pattern_name:values.pattern_name,
                pattern_description:values.pattern_description,
                pattern_pair_code:values.pattern_pair_code,
                serial_pool:values.serial_pool,
                remark:values.remark,                
                insert_by:cookies.load('userInfo').user_account
            }
            setIsSubmitting(true);
            await postAddDocPattern(qryBody)
            resetForm()
            setPos1st('');
            setPos2nd('');
            setPos3rd('');
            setPos4th('');
            setPos5th('');
            setIsSubmitting(false);
            LoginCheck()
          }}
          initialValues={{
            doc_no_pattern: '',
            start_rev_no: '',
            ref_sop_no: '',
            ref_sop_rev: '',
            pattern_name: '',
            pattern_description: '',
            pattern_pair_code:'',
            serial_pool:'',
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
            <div style={{fontSize: "100px"}}><RuleIcon fontSize ="inherit" color="primary"/></div>
            <div style={{fontSize: "40px"}}>Add Documnet Number/Code Pattern</div>
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
                <div style={{width:'100vw', display:'flex', flexWrap: 'wrap', justifyContent:'center', marginLeft:'5px', marginRight:'5px'}}>
                  <Autocomplete
                    id="Pos_1st"
                    style={{minWidth:'200px',margin:'5px'}}
                    freeSolo
                    onChange={(event, newValue) => {
                      setUniquePatternCheck(false)
                      setPos1st(newValue);
                    }}
                    value={pos1st}
                    options={patternCode.map((option) => option.elementName)}
                    renderInput={(params) => <TextField {...params} label="Pos. 1st" />}
                  />
                  <Autocomplete
                    id="Pos_2nd"
                    style={{minWidth:'200px',margin:'5px'}}
                    freeSolo
                    onChange={(event, newValue) => {
                      setUniquePatternCheck(false)
                      setPos2nd(newValue);
                    }}
                    value={pos2nd}
                    options={patternCode.map((option) => option.elementName)}
                    renderInput={(params) => <TextField {...params} label="Pos. 2nd" />}
                  />
                  <Autocomplete
                    id="Pos_3rd"
                    style={{minWidth:'200px',margin:'5px'}}
                    freeSolo
                    onChange={(event, newValue) => {
                      setUniquePatternCheck(false)
                      setPos3rd(newValue);
                    }}
                    value={pos3rd}
                    options={patternCode.map((option) => option.elementName)}
                    renderInput={(params) => <TextField {...params} label="Pos. 3rd" />}
                  />
                  <Autocomplete
                    id="Pos_4th"
                    style={{minWidth:'200px',margin:'5px'}}
                    freeSolo
                    onChange={(event, newValue) => {
                      setUniquePatternCheck(false)
                      setPos4th(newValue);
                    }}
                    value={pos4th}
                    options={patternCode.map((option) => option.elementName)}
                    renderInput={(params) => <TextField {...params} label="Pos. 4th" />}
                  />
                  <Autocomplete
                    id="Pos_5th"
                    style={{minWidth:'200px',margin:'5px'}}
                    freeSolo
                    onChange={(event, newValue) => {
                      setUniquePatternCheck(false)
                      setPos5th(newValue);
                    }}
                    value={pos5th}
                    options={patternCode.map((option) => option.elementName)}
                    renderInput={(params) => <TextField {...params} label="Pos. 5th" />}
                  />
                </div>
                <div style={{width:'35vw'}}>
                  <TextField
                    required
                    variant="standard"
                    id="doc_no_pattern"
                    name="doc_no_pattern"
                    label="Document Number Pattern"
                    value={values.doc_no_pattern=pos1st+pos2nd+pos3rd+pos4th+pos5th}
                    onChange={(e)=>{
                      handleChange(e)
                      setUniquePatternCheck(false)
                    }}
                    onBlur={handleBlur}
                    helperText={touched.doc_no_pattern ? errors.doc_no_pattern : ""}
                    error={touched.doc_no_pattern && Boolean(errors.doc_no_pattern)}
                    margin="dense"
                    fullWidth
                  />
                  <div style={{width:'100%', display:'flex', justifyContent:'flex-end'}}>
                    <Button variant="outlined" size="small" disabled={isPatternConfirming} onClick={async ()=>{
                      setUniquePatternCheck(true)
                      setIsPatternConfirming(isPatternConfirming=>true)

                      let body={
                        doc_no_pattern : values.doc_no_pattern
                      }

                      let ajaxData=await axios.post('/duplicatedocpatterncheck',body)
                      .then((res)=>res.data)
                      .catch((err)=>err)
                      
                      if(ajaxData.success){
                        if(ajaxData.result.length<1) setUniquePattern(uniquePattern=>true)
                        else setUniquePattern(uniquePattern=>false)
                      }
                      else{
                        alert(ajaxData.result)
                      }
                      await new Promise((r) => setTimeout(r, 1000));
                      validateField('doc_no_pattern')
                      setIsPatternConfirming(isPatternConfirming=>false)
                      LoginCheck()
                    }}>Confirm</Button>
                  </div>
                  <TextField
                    required
                    variant="standard"
                    id="start_rev_no"
                    name="start_rev_no"
                    label="Start Rev No"
                    value={values.start_rev_no}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.start_rev_no ? errors.start_rev_no : ""}
                    error={touched.start_rev_no && Boolean(errors.start_rev_no)}
                    margin="dense"
                    fullWidth
                  />

                  <TextField
                    required
                    variant="standard"
                    id="ref_sop_no"
                    name="ref_sop_no"
                    label="참조 SOP 번호"
                    value={values.ref_sop_no}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.ref_sop_no ? errors.ref_sop_no : ""}
                    error={touched.ref_sop_no && Boolean(errors.ref_sop_no)}
                    margin="dense"
                    fullWidth
                  />

                  <TextField
                    required
                    variant="standard"
                    id="ref_sop_rev"
                    name="ref_sop_rev"
                    label="참조 SOP 개정번호"
                    // type="text"
                    value={values.ref_sop_rev}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.ref_sop_rev ? errors.ref_sop_rev : ""}
                    error={touched.ref_sop_rev && Boolean(errors.ref_sop_rev)}
                    margin="dense"
                    fullWidth
                  />
                  <TextField
                    variant="standard"
                    id="pattern_name"
                    name="pattern_name"
                    label="문서번호 규칙 명칭"
                    // type="text"
                    value={values.pattern_name}
                    onChange={(e)=>{
                      handleChange(e)
                      setUniquePatternNameCheck(false)
                    }}
                    onBlur={handleBlur}
                    helperText={touched.pattern_name ? errors.pattern_name : ""}
                    error={touched.pattern_name && Boolean(errors.pattern_name)}
                    margin="dense"
                    fullWidth
                  />
                  <div style={{width:'100%', display:'flex', justifyContent:'flex-end'}}>
                    <Button variant="outlined" size="small" disabled={isPatternNameConfirming} onClick={async ()=>{
                      setUniquePatternNameCheck(true)
                      setIsPatternNameConfirming(isPatternNameConfirming=>true)

                      let body={
                        pattern_name : values.pattern_name
                      }

                      let ajaxData=await axios.post('/duplicatedocpatternnamecheck',body)
                      .then((res)=>res.data)
                      .catch((err)=>err)
                      
                      if(ajaxData.success){
                        if(ajaxData.result.length<1) setUniquePatternName(uniquePatternName=>true)
                        else setUniquePatternName(uniquePatternName=>false)
                      }
                      else{
                        alert(ajaxData.result)
                      }
                      await new Promise((r) => setTimeout(r, 1000));
                      validateField('pattern_name')
                      setIsPatternNameConfirming(isPatternNameConfirming=>false)
                      LoginCheck()
                    }}>Confirm</Button>
                  </div>
                  <TextField
                    required
                    variant="standard"
                    id="pattern_description"
                    name="pattern_description"
                    label="설명"
                    // type="text"
                    value={values.pattern_description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.pattern_description ? errors.pattern_description : ""}
                    error={touched.pattern_description && Boolean(errors.pattern_description)}
                    margin="dense"
                    fullWidth
                  />
                  <TextField
                    required
                    variant="standard"
                    id="pattern_pair_code"
                    name="pattern_pair_code"
                    label="Pair Code"
                    // type="text"
                    value={values.pattern_pair_code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.pattern_pair_code ? errors.pattern_pair_code : ""}
                    error={touched.pattern_pair_code && Boolean(errors.pattern_pair_code)}
                    margin="dense"
                    fullWidth
                  />
                  <TextField
                    required
                    variant="standard"
                    id="serial_pool"
                    name="serial_pool"
                    label="Serial Pool"
                    // type="text"
                    value={values.serial_pool}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.serial_pool ? errors.serial_pool : ""}
                    error={touched.serial_pool && Boolean(errors.serial_pool)}
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
      </div>     
  );
}

export default AddDocNoPattern