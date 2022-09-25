
//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import {PropTypes, Autocomplete, TextField, IconButton,ListItemAvatar,Avatar, Tabs, Tab, Box, Typography, Chip, Button, Stack, Paper,Divider,Modal, Checkbox, ListItemIcon, ListItemText, ListItem, CardHeader, Card, List, Grid} from '@mui/material/';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setSel_tb_user,setLoginExpireTime, setSelTmmsWholeAsset, setSelSapZmmr1010, setSelEqmsAtemplate } from "./../store.js"
//========================================================== MngTable 컴포넌트 import
import MngTable from './../MngTable/MngTable'
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './../Account/LoginSessionCheck.js';
//========================================================== Formik & Yup 라이브러리 import
import { Formik } from 'formik';
import * as yup from 'yup';

function AddDoc() {

    let [appDate,setAppDate] = useState(null);
    let [invDate,setInvDate] = useState(null);

    let [qualAttList,setQualAttList] = useState([
        {abb:"URS", att_name: "User Requirement Specification"},
        {abb:"RA", att_name: "Risk Analysis"},
        {abb:"IA", att_name: "Impact Assessment"},
        {abb:"VA", att_name: "Vendor Audit"},
        {abb:"FS", att_name: "Functional Specification"},
        {abb:"DFS", att_name: "Detail Functional Specification"},
        {abb:"SFS", att_name: "Software Functional Specification"},
        {abb:"HFS", att_name: "Hardware Functional Specification"},
        {abb:"DS", att_name: "Design Specification"},
        {abb:"SDS", att_name: "Software Design Specification"},
        {abb:"HDS", att_name: "Hardware Design Specification"},
        {abb:"DDS", att_name: "Detail Design Specification"},
        {abb:"FDS", att_name: "Functional & Design Specification"},
        {abb:"DQ", att_name: "Design Qualification"},
        {abb:"FAT", att_name: "Factory Acceptance Test"},
        {abb:"SAT", att_name: "Site Acceptance Test"},
        {abb:"IQ", att_name: "Installation Qualification"},
        {abb:"OQ", att_name: "Operational Qualification"},
        {abb:"PQ", att_name: "Performance Qualification"},
        {abb:"SFT", att_name: "System Functional Test"},
        {abb:"TAB", att_name: "Testing, Adjusting and Balancing"},
        {abb:"VSR", att_name: "Validation  Summary Report"},
        {abb:"RTM", att_name: "Requirment Trace Matrix"},
        {abb:"MT", att_name: "Mapping Test"},
        {abb:"ETC", att_name: "Etcetera"},
    ])
    let [qualAttFiled,setQualAttFiled]=useState();
    let [qualAtt,setQualAtt] = useState([])

    const val_att = [
        {abb:"VMP",att_name:"Validation Master Plan"},
        {abb:"VMR",att_name:"Validation Master Report"},
        {abb:"VP",att_name:"Validation Plan"},
        {abb:"PV",att_name:"Process Validation"},
        {abb:"OPV",att_name:"On-going Process Validation"},
        {abb:"CV",att_name:"Cleaning Validation"},
        {abb:"MV",att_name:"Method Validation"},
        {abb:"CMV",att_name:"Cleaning Method Validation"},
        {abb:"RT",att_name:"Recovery Test"},
        {abb:"APV",att_name:"Aseptic Process Validation"},
        {abb:"IA",att_name:"Impact Assessment"},
        {abb:"RA",att_name:"Risk Assessment"},
        {abb:"SV",att_name:"Shipping Validation"},
        {abb:"HTS",att_name:"Holding Time Study"},
        {abb:"CHT",att_name:"Cleaning Holding Time"},
        {abb:"ESV",att_name:"Excel Sheet Validation"},
    ]
    let [valAttFiled,setValAttFiled]=useState();
    let [valAtt, setValAtt] = useState([])

      //========================================================== Formik & yup Validation schema
  const schema = yup.object().shape({
    title: yup.string()
    .required('문서제목을 입력해주세요.')
    .test(
        'title_return',
        "줄바꿈은 없어야 합니다.",
        function(value){
            if(typeof(value)=="string"){
                return !value.includes("\n")
            }
        }
    ),
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
    height:'80vh',
    overflow:'auto',
    padding:'20px'
  };


  let [refresh,setRefresh] = useState(false);
  let [popUpPage,setPopUpPage] = useState(0);

  let [isSubmitting, setIsSubmitting] = useState(false); // Submit 중복 클릭 방지

  //========================================================== [변수, 객체 선언][useNaviagte]
  let navigate = useNavigate()

  //========================================================== SlidePopup 작동 redux state 관련 선언
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();

  //========================================================== [변수, 객체 선언][useEffect]
  useEffect(() => {
    // 이 페이지의 권한 유무 확인
    authCheck()

    //유저 선택 redux 초기화
    dispatch(setSel_tb_user({}))
    dispatch(setSelTmmsWholeAsset([]))
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
      if(cookies.load('userInfo').user_auth.indexOf("MNG_USER_AUTH",0)!=-1){

      }
      else{
          alert("MNG_USER_AUTH 권한이 없습니다.")
          navigate('/')
      }

    }
    else{
        alert("로그인 상태가 아닙니다.")
        navigate('/')
    }
  }

  return (
    <div style={{padding:'1vw'}}>
        <Formik
        validationSchema={schema}
        onSubmit={async (values, {resetForm})=>{
            // let qryBody = {
            //     doc_no:rdx.sel_doc_pattern,
            //     rev_no:values.req_purpose,
            //     title:values.title,
            //     written_by:rdx.sel_tb_user.user_account,
            //     written_by_team:rdx.sel_tb_user.user_team,
            //     approval_date:"2022-10-10",
            //     invalid_date:"2022-10-10",
            //     qualAtt: qualAtt,
            //     valAtt: valAtt,
            //     eqAtt: rdx.selTmmsWholeAsset,
            //     prodAtt: rdx.selSapZmmr1010,
            //     eqmsAtt: rdx.selEqmsAtemplate,
            //     isprotocol: false,
            //     relateddoc: [{docNo:"22-OQP-001",revNo:"00",relation:"protocol"}],
            //     remark:values.remark,                
            //     insert_by:cookies.load('userInfo').user_account
            // }
            setIsSubmitting(true);
            // if(qryBody.pattenrs.length>0 && qryBody.req_user.length>0 ){
            // let ajaxData = await postAddDocNo(qryBody)
            // alert("발번된 문서번호는 다음과 같습니다. \n" + ajaxData)
            // dispatch(setSel_tb_user({}))
            // dispatch(setSel_doc_pattern([]))
            // resetForm()
            // }
            // else{
            // alert("요청자와 문서번호 패턴이 선택되어야 합니다.")
            // }
            setIsSubmitting(false);
            LoginCheck()
        }}
        initialValues={{
            title:'',
            approval_date:'', 
            invalid_date: '',
            remark:''
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
            id="postAddDoc"
            component="form"
            noValidate
            onSubmit={handleSubmit}
            autoComplete="off"
            >
                <div style={{width:'100%', display:'flex', flexWrap:'wrap', justifyContent:'center'}}>
                    <Paper style={{width:'30vw', minWidth : '300px', height:'360px', padding:'10px', margin:'0.5vw', overflowY:'auto', boxSizing:'border-box'}} elevation={3}>   
                        <Stack spacing={2}>
                            <Button size="small" variant="contained" onClick={()=>{
                            setPopUpPage(0)
                            setModalTitle("문서번호 선택")
                            handleModalOpen()
                            LoginCheck()
                            }}>문서선택</Button>
                            <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                                <Chip label="문서번호" color="primary"/>
                                <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center'}}><div>{rdx.sel_doc_no.doc_no}</div></div>
                            </Stack>
                            <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                                <Chip label="개정번호" color="primary"/>
                                <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center'}}><div>{rdx.sel_doc_no.last_rev_no}</div></div>
                            </Stack>
                            <Button size="small" variant="contained" onClick={()=>{
                            setPopUpPage(4) 
                            setModalTitle("요창자 선택")
                            handleModalOpen()
                            LoginCheck()
                            }}>요청자 선택</Button>

                            <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                                <Chip label="작성자" color="primary"/>
                                <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center'}}><div>{rdx.sel_tb_user.user_account}{
                                rdx.sel_tb_user.user_name?" ("+rdx.sel_tb_user.user_name+")":""}</div></div>
                            </Stack>
                            <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                                <Chip label="작성팀" color="primary"/>
                                <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center'}}><div>{rdx.sel_tb_user.user_team}</div></div>
                            </Stack>
                        </Stack>
                    </Paper>
                    <Paper style={{width:'30vw', minWidth : '300px', height:'360px', padding:'10px', margin:'0.5vw', overflowY:'auto', boxSizing:'border-box'}} elevation={3}>
                        <Stack spacing={2}>
                            <Chip label="문서 승인정보 입력" color="primary"/>
                            <TextField
                            required
                            variant="standard"
                            id="title"
                            name="title"
                            label="Title"
                            multiline
                            rows={2}
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={touched.title ? errors.title : ""}
                            error={touched.title && Boolean(errors.title)}
                            margin="dense"
                            fullWidth
                            />
                            <div style={{width:'100%',display:'flex', marginTop:'10px'}}>
                                <div style={{ flexGrow:1, display:'block', marginRight:'10px'}}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                        fullWidth
                                        label="Approve Date"
                                        inputFormat={"YYYY-MM-DD"}
                                        mask={"____-__-__"}
                                        value={appDate}
                                        onChange={(newValue) => {
                                            setAppDate(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} color="primary"/>}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                    <Button size="small" variant="contained" onClick={()=>{
                                        setAppDate(new Date());
                                    }}>오늘</Button>
                                </div>
                            </div>
                            <div style={{width:'100%',display:'flex', marginTop:'10px'}}>
                                <div style={{ flexGrow:1, display:'block', marginRight:'10px'}}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                        fullWidth
                                        label="Invalid Date"
                                        inputFormat={"YYYY-MM-DD"}
                                        mask={"____-__-__"}
                                        value={invDate}
                                        onChange={(newValue) => {
                                            setInvDate(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} color="primary"/>}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                    <Button size="small" variant="contained" onClick={()=>{
                                        setInvDate(new Date());
                                    }}>오늘</Button>
                                </div>
                            </div>
                            <TextField
                            required
                            variant="standard"
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
                    <Paper style={{width:'30vw', minWidth : '300px', height:'360px', padding:'10px', margin:'0.5vw', overflowY:'auto', boxSizing:'border-box'}} elevation={3}>
                        <Stack spacing={2}>
                            <div style={{width:'100%',display:'flex'}}>
                                <Autocomplete
                                value={valAttFiled}
                                onChange={(event, newValue) => {
                                setValAttFiled({abb:newValue.split(" : ")[0], att_name : newValue.split(" : ")[1]});
                                }}
                                disablePortal
                                size="small"
                                id="val_att"
                                options={val_att.map((option) => option.abb + " : " + option.att_name)}
                                sx={{ flexGrow:1, marginRight:'10px'}}
                                renderInput={(params) => <TextField {...params} color="primary" label="밸리데이션 평가 성격 추가" />}
                                />
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                                    <Button size="small" variant="contained" onClick={()=>{
                                        if(valAttFiled){
                                            let tempArr = [...valAtt]
                                            console.log(tempArr.indexOf(valAttFiled))
                                            if(tempArr.indexOf(valAttFiled)==(-1)) tempArr.push(valAttFiled)
                                            setValAtt(tempArr)
                                            LoginCheck()
                                        }
                                    }}>추가</Button>
                                </div>
                            </div>
                            <div style={{width:'100%', height:'280px', overflowY:'auto', boxSizing:'border-box'}}>
                                <List>
                                    {
                                        valAtt.map((oneAtt,i)=>{
                                            return(
                                                <ListItem
                                                style={{ width: "100%" }}
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" onClick={()=>{
                                                        let temp = [...valAtt]
                                                        temp.splice(i,1)
                                                        setValAtt(temp)
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
                        </Stack>
                    </Paper>
                    <Paper style={{width:'30vw', minWidth : '300px', height:'360px', padding:'10px', margin:'0.5vw', overflowY:'auto', boxSizing:'border-box'}} elevation={3}>
                        <Stack spacing={2}>
                            <div style={{width:'100%',display:'flex'}}>
                                <Autocomplete
                                value={qualAttFiled}
                                onChange={(event, newValue) => {
                                setQualAttFiled({abb:newValue.split(" : ")[0], att_name : newValue.split(" : ")[1]});
                                }}
                                disablePortal
                                size="small"
                                id="qualAttList"
                                options={qualAttList.map((option) => option.abb + " : " + option.att_name)}
                                sx={{ flexGrow:1, marginRight:'10px'}}
                                renderInput={(params) => <TextField {...params} color="primary" label="적격성 평가 성격 추가" />}
                                />
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                                    <Button size="small" variant="contained" onClick={()=>{
                                        if(qualAttFiled){
                                            let tempArr = [...qualAtt]
                                            console.log(tempArr.indexOf(qualAttFiled))
                                            if(tempArr.indexOf(qualAttFiled)==(-1)) tempArr.push(qualAttFiled)
                                            setQualAtt(tempArr)
                                            LoginCheck()
                                        }
                                    }}>추가</Button>
                                </div>
                            </div>
                            <div style={{width:'100%', height:'280px', overflowY:'auto', boxSizing:'border-box'}}>
                                <List>
                                    {
                                        qualAtt.map((oneAtt,i)=>{
                                            return(
                                                <ListItem
                                                style={{ width: "100%" }}
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" onClick={()=>{
                                                        let temp = [...qualAtt]
                                                        temp.splice(i,1)
                                                        setQualAtt(temp)
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
                        </Stack>
                    </Paper>
                    <Paper style={{width:'30vw', minWidth : '300px', height:'360px', padding:'10px', margin:'0.5vw', overflowY:'auto', boxSizing:'border-box'}} elevation={3}>
                        <Stack spacing={2}>
                            <Button size="small" variant="contained" onClick={()=>{
                            setPopUpPage(1)
                            setModalTitle("설비선택")
                            handleModalOpen()
                            LoginCheck()
                            }}>설비선택</Button>
                            <div style={{width:'100%', height:'280px', overflowY:'auto', boxSizing:'border-box'}}>
                                <List>
                                    {
                                        rdx.selTmmsWholeAsset.map((oneAtt,i)=>{
                                            return(
                                                <ListItem
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" onClick={()=>{
                                                    let temp = [...rdx.selTmmsWholeAsset]
                                                    temp.splice(i,1)
                                                    dispatch(setSelTmmsWholeAsset(temp))
                                                    }}>
                                                    <DeleteIcon />
                                                    </IconButton>
                                                }
                                                >
                                                <ListItemIcon>
                                                    <SettingsApplicationsIcon color='primary'/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={oneAtt.eq_code}
                                                    secondary={oneAtt.eq_code_alt+" / "+oneAtt.eq_name}
                                                />
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                        </Stack>
                    </Paper>
                    <Paper style={{width:'30vw', minWidth : '300px', height:'360px', padding:'10px', margin:'0.5vw', overflowY:'auto', boxSizing:'border-box'}} elevation={3}>
                        <Stack spacing={2}>
                            <Button size="small" variant="contained" onClick={()=>{
                                setPopUpPage(2)
                                setModalTitle("제품선택")
                                handleModalOpen()
                                LoginCheck()
                                }}>제품선택</Button>
                            <div style={{width:'100%', height:'280px', overflowY:'auto', boxSizing:'border-box'}}>
                                <List>
                                    {
                                        rdx.selSapZmmr1010.map((oneAtt,i)=>{
                                            return(
                                                <ListItem
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" onClick={()=>{
                                                        console.log(rdx.selSapZmmr1010[i])
                                                        let temp = [...rdx.selSapZmmr1010]
                                                        temp.splice(i,1)
                                                        dispatch(setSelSapZmmr1010(temp))
                                                    }}>
                                                    <DeleteIcon />
                                                    </IconButton>
                                                }
                                                >
                                                <ListItemIcon>
                                                    <SettingsApplicationsIcon color='primary'/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={oneAtt.mat_code}
                                                    secondary={oneAtt.mat_name}
                                                />
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                        </Stack>
                    </Paper>
                    <Paper style={{width:'30vw', minWidth : '300px', display:'block', height:'360px', padding:'10px', margin:'0.5vw', overflowY:'auto', boxSizing:'border-box'}} elevation={3}>
                        <Stack spacing={2}>
                            <Button size="small" variant="contained" onClick={()=>{
                                setPopUpPage(3)
                                setModalTitle("eQMS 모듈 선택")
                                handleModalOpen()
                                LoginCheck()
                                }}>eQMS 모듈 선택</Button>
                            <div style={{width:'100%', height:'240px', overflowY:'auto', boxSizing:'border-box'}}>
                                <List>
                                    {
                                        rdx.selEqmsAtemplate.map((oneAtt,i)=>{
                                            return(
                                                <ListItem
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" onClick={()=>{
                                                        console.log(rdx.selEqmsAtemplate[i])
                                                        let temp = [...rdx.selEqmsAtemplate]
                                                        temp.splice(i,1)
                                                        dispatch(setSelEqmsAtemplate(temp))
                                                    }}>
                                                    <DeleteIcon />
                                                    </IconButton>
                                                }
                                                >
                                                <ListItemIcon>
                                                    <SettingsApplicationsIcon color='primary'/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={oneAtt.pr_no}
                                                    secondary={oneAtt.pr_title}
                                                />
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                            <Button size="small" variant="contained" onClick={()=>{
                                dispatch(setSelEqmsAtemplate([]))
                                }}>비우기</Button>
                        </Stack>
                    </Paper>
                </div>
                <div style={{height:'48px'}}>Page controller is here</div>
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding:'10px' }} elevation={6}>
                    <div style={{width:'100%', display:'flex', alignItems:'center', backdropFilter:'blur(10px)'}}>
                        <PostAddIcon color="primary"/>
                        <div style={{flexGrow:1, fontWeight:'bold', marginLeft:'4px'}}>문서추가</div>
                        <Button size="small" variant="contained" type="submit" form="postAddDoc" disabled={isSubmitting}>Submit</Button>
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
                <div style={{display:'block', height:'550px', overflow:"auto"}}>
                    {
                        popUpPage==0?<MngTable getUrlStr={'/adddoc_getmngdocno'} targetPk={{}} heightValue={480} tblCtrl={true} chkSel={false} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                        popUpPage==1?<MngTable getUrlStr={'/adddoc_getextdatatmmswholeasset'} targetPk={{}} heightValue={480} tblCtrl={true} chkSel={true} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                        popUpPage==2?<MngTable getUrlStr={'/adddoc_getextdatasapzmmr1010'} targetPk={{}} heightValue={480} tblCtrl={true} chkSel={true} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                        popUpPage==3?<MngTable getUrlStr={'/adddoc_getextdataeqmsatemplate'} targetPk={{}} heightValue={480} tblCtrl={true} chkSel={true} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                        popUpPage==4?<MngTable getUrlStr={'/edituserauth_getuser'} targetPk={{}} heightValue={480} tblCtrl={true} chkSel={false} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>:
                        <div></div>
                    }                    
                </div>
                </div>
            </Paper>
        </Modal>
      </div>
  );
}

export default AddDoc