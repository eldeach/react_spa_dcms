
//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useNavigate, useLocation } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import {PropTypes, Autocomplete, TextField, IconButton, Box, Typography, Chip, Button, Stack, Paper,Divider,Modal, ListItemIcon, ListItemText, ListItem, List } from '@mui/material/';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
//========================================================== Moment 라이브러리 import
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
//========================================================== QRCode 라이브러리 import
import { QRCode } from 'react-qrcode-logo';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setLoginExpireTime, setSel_doc } from "./../store.js"
//========================================================== MngTable 컴포넌트 import
import MngTable from './../MngTable/MngTable'
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './../Account/LoginSessionCheck.js';
//========================================================== Formik & Yup 라이브러리 import
import { Formik } from 'formik';
import * as yup from 'yup';
//========================================================== axios 라이브러리 import
import axios from 'axios';

function AddBinder() {
      //========================================================== Formik & yup Validation schema
  const schema = yup.object().shape({
    binder_title: yup.string()
    .required('바인더제목을 입력해주세요.'),
  });

  //========================================================== [Modal] 모달 열기/닫기 및 스타일 정의
  let [openModal, setOpenModal] = useState(false);
  let handleModalOpen = () => setOpenModal(true);
  let handleModalClose = () => setOpenModal(false);
  let [modalTitle,setModalTitle] = useState(false);
  let [popUpPage,setPopUpPage] = useState(0);
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    height:'90vh',
    overflow:'auto',
    padding:'20px'
  };
  let [isSubmitting, setIsSubmitting] = useState(false); // Submit 중복 클릭 방지

  let [yearList, setYearList] = useState([]);
  let [binderYear,setBinderYear] = useState('');
  
  let [teamList, setTeamList]=useState([]);
  let [mngTeam,setMngTeam]=useState('');

  let [locList, setLocList]=useState([]);
  let [bndLoc,setBndLoc]=useState('');

  let [bndKeyWordList,setBndKeyWordList]=useState([]);
  let [bndKeyWord,setBndKeyWord]=useState('');

  //========================================================== [변수, 객체 선언][useNaviagte]
  let navigate = useNavigate()

  //========================================================== SlidePopup 작동 redux state 관련 선언
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();

  //========================================================== [변수, 객체 선언][useEffect]
  useEffect(() => {
    // 이 페이지의 권한 유무 확인
    authCheck()

    //값 초기화
    if(targetRowObj=="N/A"){
        setBndKeyWord("OPBND")
        dispatch(setSel_doc([]))
    }
    else{
        setBndKeyWord(targetRowObj.binder_keyword)
        setBinderYear(targetRowObj.binder_year)
        setMngTeam(targetRowObj.mng_team)
        setBndLoc(targetRowObj.binder_loc)
        dispatch(setSel_doc(JSON.parse(targetRowObj.relateddoc)))
    }

    getTeams()

    getLocs()

    let nowYear=moment(new Date()).format('YYYY')
    let tempYearArry = []
    for(let i=0;i<10;i++){
        tempYearArry.push((parseInt(nowYear)-i))
    }
    setYearList(tempYearArry)
    setBinderYear(nowYear)

    setBndKeyWordList(['OPBND'])
    

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

  //========================================================== [함수][권한] 권한 점검
  function authCheck(){
    if(cookies.load('loginStat')){
      if(cookies.load('userInfo').user_auth.indexOf("ADD_EDIT_BINDER",0)!=-1){

      }
      else{
          alert("ADD_EDIT_BINDER 권한이 없습니다.")
          navigate('/')
      }

    }
    else{
        alert("로그인 상태가 아닙니다.")
        navigate('/')
    }
  }

  async function getTeams(){
    let getTeamsResult = await axios.get("/getteams")
    let teamTempList=[]
    getTeamsResult.data.result.map((oneTeam,i)=>{
        if(!oneTeam.user_team){
        }
        else
        {
            teamTempList.push(oneTeam.user_team)
        }
    })
    setTeamList(teamTempList)
  }

  async function getLocs(){
    let getLocsResult = await axios.get("/getbndlocs")
    let teamLocList=[]
    getLocsResult.data.result.map((oneLoc,i)=>{
        if(!oneLoc.binder_loc){
        }
        else
        {
            teamLocList.push({Location:oneLoc.binder_loc, Description : oneLoc.binder_loc_description})
        }
    })
    setLocList(teamLocList)
  }

  async function postAddBinder(qryBody){
    let ajaxData = await axios.post("/postaddbinder",qryBody)
    .then((res)=>res.data)
    .catch((err)=>{
      console.log(err)
    })

    if(ajaxData.success) {
        alert("부여된 바인더번호 : "+ajaxData.binder_no)
        return ajaxData.result
    }
    else alert(ajaxData)
  }

  async function putEditBinder(qryBody){
    let ajaxData = await axios.put("/puteditbinder",qryBody)
    .then((res)=>res.data)
    .catch((err)=>{
      console.log(err)
    })

    if(ajaxData.success) return ajaxData.result
    else console.log(ajaxData)
  }

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  return (
    <div style={{padding:'0.5vw'}}>
        <Formik
        validationSchema={schema}
        onSubmit={async (values, {resetForm})=>{
            setIsSubmitting(true);
            if(!mngTeam||!bndKeyWord||!binderYear||!bndLoc||rdx.sel_doc.length<1){
                alert("관리부서, 발행년도, 보관위치, 바인딩할 문서 선택이 되어야 합니다.")
            }
            else{
                if(targetRowObj=="N/A"){
                    let qryBody = {
                        binder_title:values.binder_title,
                        relateddoc: JSON.stringify(rdx.sel_doc),
                        binder_year:binderYear,
                        mng_team:mngTeam,
                        binder_loc:bndLoc,
                        current_loc:bndLoc,
                        relateddoc: JSON.stringify(rdx.sel_doc),
                        binder_keyword:bndKeyWord,
                        remark:values.remark,
                        insert_by:cookies.load('userInfo').user_account
                    }
                    
                    let ajaxData = await postAddBinder(qryBody)
                    console.log(ajaxData)
                }
                else{
                    let qryBody = {
                        binder_no:targetRowObj.binder_no,
                        binder_title:values.binder_title,
                        relateddoc: JSON.stringify(rdx.sel_doc),
                        binder_year:binderYear,
                        mng_team:mngTeam,
                        binder_loc:bndLoc,
                        relateddoc: JSON.stringify(rdx.sel_doc),
                        binder_keyword:bndKeyWord,
                        remark:values.remark,
                        update_by:cookies.load('userInfo').user_account,
                        uuid_binary:targetRowObj.uuid_binary
                    }
                    let ajaxData = await putEditBinder(qryBody)
                    console.log(ajaxData)
                    navigate(-1)
                }
                
                dispatch(setSel_doc([]))
                setBinderYear('')
                setMngTeam('')
                setBndLoc('')
                resetForm()
            }
            
            setIsSubmitting(false);
            LoginCheck()

        }}
        initialValues={!location.state ?{
            binder_title:'',
            remark:''
        }:{
            binder_title:targetRowObj.binder_title,
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
            id="postAddBinder"
            component="form"
            onKeyDown={onKeyDown}
            noValidate
            onSubmit={handleSubmit}
            autoComplete="off"
            >
                <div style={{width:'100%', display:'flex', flexWrap:'wrap', justifyContent:'center'}}>
                    {
                        !location.state ?
                        <div></div>
                        :
                        <Paper className="seperate-paper" elevation={3}>
                            <Stack style={{textAlign:'center'}} spacing={2}>
                                <Chip label="바인더 번호" color="primary"/>
                                <div style={{height:'30px'}}/>
                                <div><QRCode value={targetRowObj.binder_no} logoImage="public/logo192.png" fgColor="#2196f3"/></div>
                                <Typography variant="subtitle1">{targetRowObj.binder_no}</Typography>
                            </Stack>
                        </Paper>
                    }
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <Chip label="바인더 정의" color="primary"/>
                            <Autocomplete
                            value={bndKeyWord}
                            onChange={(event, newValue) => {
                                setBndKeyWord(newValue);
                            }}
                            disablePortal
                            size="small"
                            id="bndKeyWord"
                            disabled={bndKeyWordList.length==1}
                            options={bndKeyWordList.map((option) => option)}
                            sx={{ flexGrow:1, marginRight:'10px'}}
                            renderInput={(params) => <TextField {...params} color="primary" label="바인더 키워드" />}
                            />
                            <TextField
                            required
                            variant="outlined"
                            id="binder_title"
                            name="binder_title"
                            label="바인더 제목"
                            multiline
                            rows={4}
                            value={values.binder_title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={touched.binder_title ? errors.binder_title : ""}
                            error={touched.binder_title && Boolean(errors.binder_title)}
                            margin="dense"
                            fullWidth
                            />
                        </Stack>
                    </Paper>
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <Button size="small" variant="contained" onClick={()=>{
                                setPopUpPage(0)
                                setModalTitle("관련문서 선택")
                                handleModalOpen()
                                LoginCheck()
                                }}>관련문서 선택</Button>
                            <div style={{width:'100%', height:'300px', overflowY:'auto', boxSizing:'border-box'}}>
                                <List>
                                    {
                                        rdx.sel_doc.map((oneAtt,i)=>{
                                            return(
                                                <ListItem
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" onClick={()=>{
                                                        let temp = [...rdx.sel_doc]
                                                        temp.splice(i,1)
                                                        dispatch(setSel_doc(temp))
                                                    }}>
                                                    <DeleteIcon />
                                                    </IconButton>
                                                }
                                                >
                                                <ListItemIcon>
                                                    <SettingsApplicationsIcon color='primary'/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={oneAtt.doc_no + "(" + oneAtt.rev_no + ")"}
                                                    secondary={oneAtt.doc_title}
                                                />
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                            <Button size="small" variant="contained" onClick={()=>{
                                dispatch(setSel_doc([]))
                            }}>비우기{" ("+rdx.sel_doc.length+")"}</Button>
                        </Stack>
                    </Paper>
                    <Paper className="seperate-paper" elevation={3}>
                        <Stack spacing={2}>
                            <Chip label="바인더 관리 정보" color="primary"/>
                            <Autocomplete
                            value={binderYear}
                            onChange={(event, newValue) => {
                            setBinderYear(newValue);
                            }}
                            disablePortal
                            size="small"
                            id="yearList"
                            options={yearList.map((option) => option)}
                            sx={{ flexGrow:1, marginRight:'10px'}}
                            renderInput={(params) => <TextField {...params} color="primary" label="발행년도" />}
                            />
                            <Autocomplete
                            value={mngTeam}
                            onChange={(event, newValue) => {
                                setMngTeam(newValue);
                            }}
                            disablePortal
                            size="small"
                            id="mngTeam"
                            options={teamList.map((option) => option)}
                            sx={{ flexGrow:1, marginRight:'10px'}}
                            renderInput={(params) => <TextField {...params} color="primary" label="관리부서" />}
                            />
                            <Autocomplete
                            value={bndLoc}
                            onChange={(event, newValue) => {
                                setBndLoc(newValue.split(" : ")[0]);
                            }}
                            disablePortal
                            size="small"
                            id="bndLoc"
                            options={locList.map((option) => option.Location + " : " + option.Description)}
                            sx={{ flexGrow:1, marginRight:'10px'}}
                            renderInput={(params) => <TextField {...params} color="primary" label="바인더 위치" />}
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
                </div>
                <div style={{height:'48px'}}/>
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding:'10px' }} elevation={6}>
                    <div style={{width:'100%', display:'flex', alignItems:'center', backdropFilter:'blur(10px)'}}>
                        <PostAddIcon color="primary"/>
                        <Typography variant="BUTTON" component="div" sx={{ flexGrow: 1, overflow:'hidden', marginLeft:'4px' }}>{(targetRowObj=="N/A")?"바인더 정보 추가":"바인더 정보 수정"}</Typography>
                        <Button size="small" variant="contained" type="submit" form="postAddBinder" disabled={isSubmitting}>Submit</Button>
                        <Button style={{marginLeft:'1vw'}} size="small" variant="contained" onClick={async ()=>{
                        LoginCheck()
                        navigate(-1)
                        }}>Cancel</Button>
                    </div>
                </Paper>
            </Box>
        )}</Formik>

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
                {
                    popUpPage==0?<MngTable getUrlStr={'/adddoc_getmngdoc'} targetPk={{}} heightValue={'72vh'} tblCtrl={true} chkSel={true} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                    <div></div>
                }                    
                </div>
            </Paper>
        </Modal>
      </div>
  );
}

export default AddBinder