//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect,useRef,useState } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== QRCode 라이브러리 import
import {PropTypes, Table,TableBody,TableCell,TableContainer,TableHead,TableRow, Box,Autocomplete, Tooltip, TextField,Button,Paper, Typography, Stack, Chip } from '@mui/material/';

import PrintIcon from '@mui/icons-material/Print';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import ReactToPrint from 'react-to-print';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setLoginExpireTime } from "./../store.js"
//========================================================== Moment 라이브러리 import
import moment from 'moment';
import 'moment/locale/ko';	//대한민국

//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './../Account/LoginSessionCheck.js';
//========================================================== Formik & Yup 라이브러리 import
import { Formik } from 'formik';
import * as yup from 'yup';
//========================================================== axios 라이브러리 import
import axios from 'axios';
import { TableFooter } from '@material-ui/core';



function PrintBinder(){
  let [dateFrom,setDateFrom]=useState(null);
  let [dateTo,setDateTo]=useState(null); 
  let [historyData,setHistoryData]=useState([]);
  function createData( action_datetime, binder_no, binder_title, relateddoc, binder_loc, current_loc, move_type, confirmed_by) {
    return { action_datetime, binder_no, binder_title, relateddoc, binder_loc, current_loc, move_type, confirmed_by };
  }

   //========================================================== Formik & yup Validation schema
  const schema = yup.object().shape({

    // binder_year: yup.number()
    // .test(
    //     'length',
    //     "연도는 4자리 숫자로 입력해야 합니다.",
    //     function(value){
    //         if(typeof(value)=="string"){
    //             return !(value.length==4)
    //         }
    //     }
    // ),
  });

//========================================================== useNaviagte 선언
let navigate = useNavigate()
  //========================================================== SlidePopup 작동 redux state 관련 선언
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();
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

  async function getHistory(){
    
    let dtTo
    if(moment(new Date(dateTo)).format('YYYY-MM-DD')=='1970-01-01'){
      dtTo=moment(new Date()).format('YYYY-MM-DD')
    }
    else{
      dtTo = moment(new Date(dateTo)).format('YYYY-MM-DD')
    }

    let allParams={
      dateFrom:moment(new Date(dateFrom)).format('YYYY-MM-DD'),
      dateTo:dtTo
    }
    let ajaxData = await axios({
      method:"get",
      url:"/getbindermovehistoryprint",
      params:allParams,
      headers:{
          'Content-Type':'application/json'
      }})
      .then((res)=>{
        return res.data
      })
      .catch((err)=>console.log(err))

      console.log(ajaxData)

      setHistoryData(ajaxData.result)
  }

  //========================================================== [ADD form에서 추가] 수정할 row Oject state 넘겨받기 위한 코드
  const location = useLocation();
  const targetRowObj= (!location.state ? "N/A" : location.state.rowObj)
  
    function authCheck(){
        if(cookies.load('loginStat')){
            if(cookies.load('userInfo').user_auth.indexOf("MNG_BINDER_INFO",0)!=-1){
            }
            else{
                alert("MNG_BINDER_INFO 권한이 없습니다.")
                navigate('/')
            }

        }
        else{
            alert("로그인 상태가 아닙니다.")
            navigate('/')
        }
    }


    const componentRef = useRef(null);
    function BinderMoveHistory(props){    
        return (
            <div style={{marginLeft:'4px', marginRight:'4px'}} ref={props.printRef}>
              <div className='page-print-header'>
                <div className='page-print-header-content'>
                  <div style={{marginLeft:'10px', fontSize:'4px', fontWeight:'bold'}}>{"DAEWOONG Osong Plant"}</div>
                  <div style={{marginRight:'20px', fontSize:'4px', flexGrow:1, textAlign:'right'}}>{"바인더 입/출고 이력 (조회기간 : "+(moment(new Date(dateFrom)).format('YYYY-MM-DD')=='1970-01-01'?"":moment(new Date(dateFrom)).format('YYYY-MM-DD'))+"~"+(moment(new Date(dateTo)).format('YYYY-MM-DD')=='1970-01-01'?moment(new Date()).format('YYYY-MM-DD'):moment(new Date(dateTo)).format('YYYY-MM-DD'))+")"}</div>
                </div>
              </div>
              <TableContainer >
              <Table sx={{ minWidth: 650 }} size="small" aria-label="History of Binder import, export">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div style={{display:'flex'}}>
                        <div style={{marginLeft:'10px', fontSize:'4px', fontWeight:'bold'}}>{"DAEWOONG Osong Plant"}</div>
                        <div style={{marginRight:'20px', fontSize:'4px', flexGrow:1, textAlign:'right'}}>{"바인더 입/출고 이력 (조회기간 : "+(moment(new Date(dateFrom)).format('YYYY-MM-DD')=='1970-01-01'?"":moment(new Date(dateFrom)).format('YYYY-MM-DD'))+"~"+(moment(new Date(dateTo)).format('YYYY-MM-DD')=='1970-01-01'?moment(new Date()).format('YYYY-MM-DD'):moment(new Date(dateTo)).format('YYYY-MM-DD'))+")"}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left"><div style={{fontSize:'4px', width:'60px'}}>이동일시</div></TableCell>
                    <TableCell align="left"><div style={{fontSize:'4px', width:'75px'}}>바인더 번호</div></TableCell>
                    <TableCell align="left"><div style={{fontSize:'4px', width:'250px'}}>바인더 제목</div></TableCell>
                    <TableCell align="left"><div style={{fontSize:'4px', width:'250px'}}>바인딩 문서</div></TableCell>
                    <TableCell align="left"><div style={{fontSize:'4px', width:'35px'}}>정위치</div></TableCell>
                    <TableCell align="right"><div style={{fontSize:'4px', width:'60px'}}>이동위치</div></TableCell>
                    <TableCell align="right"><div style={{fontSize:'4px', width:'40px'}}>이동유형</div></TableCell>
                    <TableCell align="right"><div style={{fontSize:'4px', width:'60px'}}>승인자</div></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyData.map((row) => (
                    <TableRow
                      key={row.action_datetime}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row"><div style={{fontSize:'4px', width:'60px'}}>{moment(new Date(row.action_datetime)).format('YYYY-MM-DD HH:mm:ss')}</div></TableCell>
                      <TableCell align="left"><div style={{fontSize:'4px', width:'75px'}}>{row.binder_no}</div></TableCell>
                      <TableCell align="left"><div style={{fontSize:'4px', width:'250px'}}>{row.binder_title}</div></TableCell>
                      <TableCell align="left">{
                      JSON.parse(row.relateddoc).map((oneDoc,i)=>{
                        return(
                          <div style={{display:'block', width:'250px'}}>
                            <div style={{fontSize:'4px'}}>{"("+(i+1)+") "+oneDoc.doc_no+'(개정번호 : '+oneDoc.rev_no+')'}</div>
                            <div style={{fontSize:'4px', marginLeft:'15px'}}>{'문서제목 : "'+oneDoc.doc_title+'"'}</div>
                          </div>
                        )
                      })
                      }</TableCell>
                      <TableCell align="left"><div style={{fontSize:'5px', width:'35px'}}>{row.binder_loc}</div></TableCell>
                      <TableCell align="right">{
                      row.current_loc.indexOf("user_account")==(-1)?
                      <div style={{fontSize:'4px', width:'60px'}}>{row.current_loc}</div>
                      :<div style={{display:'block', width:'60px'}}>
                        <div style={{fontSize:'4px'}}>{JSON.parse(row.current_loc).user_name+" 님"}</div>
                        <div style={{fontSize:'4px'}}>{"(소속 : " + JSON.parse(row.current_loc).user_team+")"}</div>
                      </div>              
                      }</TableCell>
                      <TableCell align="right"><div style={{fontSize:'5px', width:'40px'}}>{row.move_type}</div></TableCell>
                      <TableCell align="right">
                        <div style={{display:'block', width:'60px'}}>
                          <div style={{fontSize:'4px'}}>{JSON.parse(row.confirmed_by).user_name+" 님"}</div>
                          <div style={{fontSize:'4px'}}>{"(소속 : " + JSON.parse(row.confirmed_by).user_team+")"}</div>
                        </div> 
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell colSpan={8}><div style={{height:'40px'}}></div></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
            <div className='page-print-footer'>
              <div className='page-print-footer-content'>
                <div style={{marginLeft:'10px', fontSize:'4px'}}>{"Print By : "+cookies.load('userInfo').user_name+" ("+cookies.load('userInfo').user_account+") / " + moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div style={{marginRight:'20px', fontSize:'4px', flexGrow:1, textAlign:'right', fontStyle:'italic', fontWeight:'bold'}}>{"CONFIDENTIAL"}</div>
              </div>
            </div>
          </div>
        )
    }
    return(
        <div style={{display:'block', padding:'0.5vw'}}>
            <Formik
            validationSchema={schema}
            onSubmit={async (values, {resetForm})=>{

                LoginCheck()
            }}
            initialValues={{
              searchKeyWord:''
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
                id="printBinderMoveHistoryForm"
                component="form"
                noValidate
                onSubmit={handleSubmit}
                autoComplete="off"
                >
                    <div style={{width:'100vw', marginBottom:'6px', display:'flex', flexWrap:'wrap', justifyContent:'center'}}>
                    <Paper className="seperate-paper-cfg" elevation={3}>
                        <Stack spacing={2}>
                          <Chip label="인쇄범위 선택" color="primary"/>
                          <div style={{width:'100%',display:'flex', marginTop:'20px'}}>
                            <div style={{ flexGrow:1, display:'block', marginRight:'10px'}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                    fullWidth
                                    label="Date From"
                                    inputFormat={"YYYY-MM-DD"}
                                    mask={"____-__-__"}
                                    value={dateFrom}
                                    onChange={(newValue) => {
                                        setDateFrom(new Date(newValue));
                                    }}
                                    renderInput={(params) => <TextField {...params} color="primary"/>}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                <Button size="small" variant="contained" onClick={()=>{
                                    setDateFrom(new Date());
                                }}>오늘</Button>
                            </div>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                <Button size="small" variant="contained" onClick={()=>{
                                    setDateFrom(null);
                                }}>삭제</Button>
                            </div>
                          </div>
                          <div style={{width:'100%',display:'flex', marginTop:'20px'}}>
                            <div style={{ flexGrow:1, display:'block', marginRight:'10px'}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                    fullWidth
                                    label="To"
                                    inputFormat={"YYYY-MM-DD"}
                                    mask={"____-__-__"}
                                    value={dateTo}
                                    onChange={(newValue) => {
                                      setDateTo(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} color="primary"/>}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                <Button size="small" variant="contained" onClick={()=>{
                                    setDateTo(new Date());
                                }}>오늘</Button>
                            </div>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'center', marginLeft:'4px'}}>
                                <Button size="small" variant="contained" onClick={()=>{
                                    setDateTo(null);
                                }}>삭제</Button>
                            </div>
                          </div>
                          <Button size="small" variant="contained" onClick={async ()=>{
                                    await getHistory()
                                }}>조회</Button>
                        </Stack>
                      </Paper>
                    </div>
                    
                    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding:'10px', zIndex:'100' }} elevation={6}>
                        <div style={{width:'100%', display:'flex', alignItems:'center', backdropFilter:'blur(10px)'}}>
                            <PrintIcon color="primary"/>
                            <Typography variant="BUTTON" component="div" sx={{ flexGrow: 1, overflow:'hidden', marginLeft:'4px' }}>{"바인더 입/출고 이력 인쇄"}</Typography>
                            <ReactToPrint
                            trigger={() => <Button variant="contained"> <PrintIcon fontSize="small"/></Button>}
                            content={() => componentRef.current}
                            />
                            <Button style={{marginLeft:'1vw'}} size="small" variant="contained" onClick={async ()=>{
                            LoginCheck()
                            navigate(-1)
                            }}>Cancel</Button>
                        </div>
                    </Paper>
            </Box>
        )}</Formik>
        <BinderMoveHistory printRef={componentRef} />
        <div style={{height:'66px'}}/>
    </div>
    )
}

export default PrintBinder