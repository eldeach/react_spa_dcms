//========================================================== React 라이브러리 import
import { useEffect,useState } from 'react';
import {  useNavigate, useLocation } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import {PropTypes, Autocomplete, Switch, FormControlLabel, TextField, IconButton, Box, Typography, Chip, Button, Stack, Paper,Divider,Modal, ListItemIcon, ListItemText, ListItem, List } from '@mui/material/';
//---------------------------------------------------------- Material Icons
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setLoginExpireTime } from "../store.js"
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './../Account/LoginSessionCheck.js';
//========================================================== Formik & Yup 라이브러리 import
import { Formik } from 'formik';
import * as yup from 'yup';
//========================================================== axios 라이브러리 import
import axios from 'axios';


function AddBinderLoc(){
          //========================================================== Formik & yup Validation schema
  const schema = yup.object().shape({
    binder_loc: yup.string()
    .required('바인더 위치 번호를 입력해주세요.')
    .test(
        'is_unique_loc',
        '바인더 위치 번호 중복체크가 필요합니다.',
        (value, context) => uniqueLocCheck||!(targetRowObj=="N/A")
    )
    .test(
        'not_dup_loc',
        '중복된 바인더 위치 번호입니다.',
        (value, context) => uniqueLoc||!(targetRowObj=="N/A")
    ),
    bndLocDes:yup.string()
    .required('바인더 위치에 대한 설명을 입력해주세요.'),
  });
  let [isSubmitting, setIsSubmitting] = useState(false); // Submit 중복 클릭 방지
  let [isLocConfirming, setIsLocConfirming] = useState(false); // pattern Confirm 중복 클릭 방지
  let [uniqueLocCheck,setUniqueLocCheck] = useState(false); // pattern 유일성 점검을 한적이 있는지 체크
  let [uniqueLoc,setUniqueLoc] = useState(false); // pattern 유일성이 확보되어 있는지 체크
    let [tblCtrl,setTblCtrl]=useState(true)
    //========================================================== [변수, 객체 선언] 선택된 정보 redux 저장용
    let rdx = useSelector((state) => { return state } )
    let dispatch = useDispatch();
    //========================================================== useNaviagte 선언
    let navigate = useNavigate()
    //========================================================== useEffect 코드
    useEffect(() => {
        // 이 페이지의 권한 유무 확인
        authCheck()
    },[]);
    
    function authCheck(){
        if(cookies.load('loginStat')){
            if(cookies.load('userInfo').user_auth.indexOf("CFG_BINDER_LOC",0)!=-1){
                setTblCtrl(true)
            }
            else{
                alert("CFG_BINDER_LOC 권한이 없습니다.")
                navigate('/')
            }
        }
        else{
            alert("로그인 상태가 아닙니다.")
            navigate('/')
        }
    }
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

    async function postAddBinderLoc(qryBody){
        let ajaxData = await axios.post("/postaddcfgbinderloc",qryBody)
        .then((res)=>res.data)
        .catch((err)=>{
            console.log(err)
        })

        if(ajaxData.success) return ajaxData.result
        else alert(ajaxData)
    }

    async function putEditBinderLoc(qryBody){
        let ajaxData = await axios.put("/puteditcfgbinderloc",qryBody)
        .then((res)=>res.data)
        .catch((err)=>{
            console.log(err)
        })
        console.log(ajaxData)
        if(ajaxData.success) return ajaxData.result
        else alert(ajaxData)
    }

    return(
        <div style={{padding:'0.5vw'}}>
            <Formik
            validationSchema={schema}
            onSubmit={async (values, {resetForm})=>{
                setIsSubmitting(true);
                if(targetRowObj=="N/A"){
                    let qryBody = {
                        binder_loc:values.binder_loc,
                        binder_loc_description:values.bndLocDes,
                        remark:values.remark,
                        insert_by:cookies.load('userInfo').user_account
                    }
                    let ajaxData = await postAddBinderLoc(qryBody)
                    console.log(ajaxData)
                    navigate(-1)
                }
                else{
                    let qryBody = {
                        binder_loc:values.binder_loc,
                        binder_loc_description:values.bndLocDes,
                        remark:values.remark,
                        uuid_binary:targetRowObj.uuid_binary,
                        update_by:cookies.load('userInfo').user_account
                    }
                    let ajaxData = await putEditBinderLoc(qryBody)
                    console.log(ajaxData)
                    navigate(-1)
                }
                resetForm()
                setIsSubmitting(false);
                LoginCheck()

            }}
            initialValues={!location.state ?{
                binder_loc:'',
                bndLocDes:'',
                remark:''
            }:{
                binder_loc:targetRowObj.binder_loc,
                bndLocDes:targetRowObj.binder_loc_description,
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
                id="cfgBinderLocForm"
                component="form"
                noValidate
                onSubmit={handleSubmit}
                autoComplete="off"
                >
                    <div style={{width:'100%', display:'flex', flexWrap:'wrap', justifyContent:'center'}}>
                        <Paper className="seperate-paper-cfg" elevation={3}>
                            <Stack spacing={2}>
                                <Chip label="바인더 위치 구성" color="primary"/>
                                <TextField
                                required
                                disabled={!(targetRowObj=="N/A")}
                                size="small"
                                variant="outlined"
                                id="binder_loc"
                                name="binder_loc"
                                label="바인더 위치 번호"
                                value={values.binder_loc}
                                onChange={(e)=>{
                                    handleChange(e)
                                    setUniqueLocCheck(false)
                                  }}
                                onBlur={handleBlur}
                                helperText={touched.binder_loc ? errors.binder_loc : ""}
                                error={touched.binder_loc && Boolean(errors.binder_loc)}
                                margin="dense"
                                fullWidth
                                />
                                <Button variant="outlined" size="small" disabled={isLocConfirming||!(targetRowObj=="N/A")} onClick={async ()=>{
                                setUniqueLocCheck(true)
                                setIsLocConfirming(isLocConfirming=>true)

                                let body={
                                    binder_loc : values.binder_loc
                                }

                                let ajaxData=await axios.post('/duplicatebinderloccheck',body)
                                .then((res)=>res.data)
                                .catch((err)=>err)
                                
                                if(ajaxData.success){
                                    if(ajaxData.result.length<1) setUniqueLoc(uniquePattern=>true)
                                    else setUniqueLoc(uniquePattern=>false)
                                }
                                else{
                                    alert(ajaxData.result)
                                }
                                await new Promise((r) => setTimeout(r, 1000));
                                validateField('binder_loc')
                                setIsLocConfirming(isLocConfirming=>false)
                                LoginCheck()
                                }}>중복확인</Button>
                                <TextField
                                required
                                size="small"
                                variant="outlined"
                                id="bndLocDes"
                                name="bndLocDes"
                                label="바인더 위치 설명"
                                value={values.bndLocDes}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={touched.bndLocDes ? errors.bndLocDes : ""}
                                error={touched.bndLocDes && Boolean(errors.bndLocDes)}
                                margin="dense"
                                fullWidth
                                />
                                <TextField
                                size="small"
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
                            <PermDataSettingIcon color="primary"/>
                            <Typography variant="BUTTON" component="div" sx={{ flexGrow: 1, overflow:'hidden', marginLeft:'4px' }}>{(targetRowObj=="N/A")?"바인더 위치 추가":"바인더 위치 정보 수정"}</Typography>
                            <Button size="small" variant="contained" type="submit" form="cfgBinderLocForm" disabled={isSubmitting}>Submit</Button>
                            <Button style={{marginLeft:'1vw'}} size="small" variant="contained" onClick={async ()=>{
                            LoginCheck()
                            navigate(-1)
                            }}>Cancel</Button>
                        </div>
                    </Paper>
                </Box>
            )}</Formik>

        </div>

    )
}
export default AddBinderLoc