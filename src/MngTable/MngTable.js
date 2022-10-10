//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import { DataGrid, GridToolbarExport } from '@mui/x-data-grid';
import {PropTypes, Box,TextField,Button,Paper, Modal, Divider, Typography, Stack, Chip, Tooltip , CircularProgress, Backdrop} from '@mui/material/';
//---------------------------------------------------------- Material Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import CheckIcon from '@mui/icons-material/Check';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import PrintIcon from '@mui/icons-material/Print';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import WifiFindIcon from '@mui/icons-material/WifiFind';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddIcon from '@mui/icons-material/Add';
//========================================================== Formik & Yup 라이브러리 import
import { Formik } from 'formik';
import * as yup from 'yup';
//========================================================== axios 라이브러리 import
import axios from 'axios';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Moment 라이브러리 import
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
//========================================================== Redux import
import { useDispatch, useSelector } from "react-redux"
import { setSel_tb_user,setSel_doc_pattern, setSel_doc_pattern_cols, setLoginExpireTime, setSel_doc_no, setSel_doc, setSelTmmsWholeAsset, setSelSapZmmr1010, setSelEqmsAtemplate, setSelTmmsLocation } from "./../store.js"
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './../Account/LoginSessionCheck.js';

function MngTable(props) {
//========================================================== [Backdrop] 모달 열기/닫기 및 스타일 정의
  let [openBackDrop, setOpenBackDrop] = useState(false);
  let [openModalBackDrop,setOpenModalBackDrop] = useState(false);
  //========================================================== [Modal] 모달 열기/닫기 및 스타일 정의
  let [openModal, setOpenModal] = useState(false);
  let handleModalOpen = () => {
    setOpenModal(true);
  }
  let handleModalClose = () => {
    setOpenModal(false);
  }
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

  let [isModalSubmitting,setIsModalSubmitting] = useState(false);
  //========================================================== [변수, 객체 선언][useNaviagte]
  let navigate = useNavigate()

  //========================================================== [변수, 객체 선언] 선택된 정보 redux 저장용
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();

  //========================================================== [변수, 객체 선언][테이블 조작 폼] 작동 Satae 정의
  let [isSubmitting, setIsSubmitting] = useState(false); // Submit 중복 클릭 방지
  let [isResetting, setIsResetting] = useState(false); // Reset 중복 클릭 방지
  let [delRowBt,setDelRowBt] = useState(false); // 행 삭제 버튼 클릭 여부 확인
  let [addRowBt,setAddRowBt] = useState(false); // 연관 테이블에 행 추가 버튼 클릭 여부 확인

  //========================================================== [변수, 객체 선언][테이블 조작 폼] 유효성 검사 yup 스키마
  // 테이블 조작 폼 yup 스키마
  const schema = yup.object().shape({
    searchKeyWord: yup.string()
    .required('검색어를 입력해주세요.')
  });

  // 모달 폼 yup 스키마
  const paperschema = yup.object().shape({
    sign_user_pw: yup.string()
    .required('현재 사용자의 패스워드를 입력해주세요.')
  });


  //========================================================== [변수, 객체 선언][useEffect]
  useEffect(() => {
    //초기 Table 조회
    InitializeTbl()
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

  //========================================================== [변수, 객체 선언][테이블] DataGrid Table 작동 state 정의
  let [pageSize, setPageSize] = useState(20);
  let [rowHtAuto,setRowHtAuto] = useState(true);
  let [cols,setCols] = useState([]); // Material UI Col 정의 State
  let [rows,setRows] = useState([]); // Material UI Row 정의 State
  let [pickRows,setPickRows]= useState([]);
  let [clickRow,setClickRow]=useState();

  //========================================================== [함수][테이블] 검색어 없는 상태로 조회하여 컬럼, 행 데이터 state에 저장
  async function InitializeTbl (){
    let tempData = await InitialQry({searchKeyWord : ""})
    setCols(tempData.tempCol)
    setRows(tempData.tempRow)
  }

  //========================================================== [함수][테이블] 서버 데이터 조회하여 컬럼 및 행 데이터 생성해줌
  //(테이블 폼에서 검색어 반영기능 포함, get ajax url은 props로 받고 이에 따라 요청 param도 가변)
  async function InitialQry(para){
    setOpenBackDrop(true) 
    let allParams={}
    // get URL 및 params 가변 코드 라인 시작
    if (props.getUrlStr=="/edituserauth_getuserauth")
    {
      allParams={
          searchKeyWord : para.searchKeyWord,
          targetPk : props.targetPk   
      }
    }
    else if (props.getUrlStr=="/edituserauth_getusernoauth")
    {
      allParams={
          searchKeyWord : para.searchKeyWord,
          targetPk : props.targetPk   
      }
    }
    else if(props.getUrlStr=="/getgroupwareuser")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }
    else if(props.getUrlStr=="/getmngaccount")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }
    else if(props.getUrlStr=="/getaudittrail")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }
    else if(props.getUrlStr=="/getmngdocnopattern")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }

    else if(props.getUrlStr=="/adddocno_getmngdocnopattern")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }
    
    else if(props.getUrlStr=="/getmngdocno")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }

    else if(props.getUrlStr=="/adddoc_getmngdocno")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }

    else if(props.getUrlStr=="/getextdatatmmswholeasset")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }

    else if(props.getUrlStr=="/adddoc_getextdatatmmswholeasset")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }

    else if(props.getUrlStr=="/adddoc_getextdatasapzmmr1010")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }

    else if(props.getUrlStr=="/adddoc_getextdataeqmsatemplate")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }

    else if(props.getUrlStr=="/getmngdoc")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }

    else if(props.getUrlStr=="/adddoc_getmngdoc")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }

    else if(props.getUrlStr=="/adddoc_getextdatatmmslocation")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }

    else if(props.getUrlStr=="/getmngbinder")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }

    else if(props.getUrlStr=="/getbindermovehistory")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }

    else if(props.getUrlStr=="/getmnguser")
    {
      allParams={
        searchKeyWord : para.searchKeyWord,
      }
    }

    else if(props.getUrlStr=="/getmyimexbinderhistory")
    {
      allParams={
        user_account: cookies.load('userInfo').user_account,
        searchKeyWord : para.searchKeyWord,
      }
    }

    else if(props.getUrlStr=="/getmydocno")
    {
      allParams={
        user_account: cookies.load('userInfo').user_account,
        searchKeyWord : para.searchKeyWord,
      }
    }
    
    let ajaxData = await axios({
      method:"get",
      url:props.getUrlStr,
      params:allParams,
      headers:{
          'Content-Type':'application/json'
      }})
      .then((res)=>{
        return res.data
      })
      .catch((err)=>console.log(err))
    // get URL 및 params 가변 코드 라인 끝
    
    let tempCol=[]
    let tempRow =[]
    
    if(!ajaxData.success){
      console.log("테이블 정보 조회를 실패했습니다.")
    }
    else{
      // 컬럼 및 행 데이터 분류 시작
      if (ajaxData.result.length>0) // (조회된 데이터가 있는 경우에만 작동)
      {
        if (props.editable){
          let actionMinWidth
          if(props.getUrlStr=="/getmngbinder") actionMinWidth=260
          else actionMinWidth= 100
          tempCol.push({
            field: 'action',
            headerName: 'Action',
            minWidth:(actionMinWidth),
            flex:1,
            sortable: false,
            renderCell:(cellValues) => {
              if(props.getUrlStr=="/getmngaccount"){
                return (
                  <Button
                    variant="contained"
                    onClick={(event) => {
                      navigate('/editaccount',{state: {
                        rowObj: cellValues.row,
                      },})
                    }}
                  >
                    <EditIcon fontSize="small"/>
                  </Button>
                )
              }
              else if(props.getUrlStr=="/getmngdocnopattern"){
                return (
                  <Button
                    variant="contained"
                    onClick={(event) => {
                      navigate('/editdocnopattern',{state: {
                        rowObj: cellValues.row,
                      },})
                    }}
                  >
                    <EditIcon fontSize="small"/>
                  </Button>
                )
              }
              else if(props.getUrlStr=="/getmngdocno"){
                return (
                  <Button
                    variant="contained"
                    onClick={(event) => {
                      navigate('/editdocno',{state: {
                        rowObj: cellValues.row,
                      },})
                    }}
                  >
                    <EditIcon fontSize="small"/>
                  </Button>
                )
              }
              else if(props.getUrlStr=="/getmngdoc"){
                return (
                  <Button
                    variant="contained"
                    onClick={(event) => {
                      navigate('/editdoc',{state: {
                        rowObj: cellValues.row,
                      },})
                    }}
                  >
                    <EditIcon fontSize="small"/>
                  </Button>
                )
              }
              else if(props.getUrlStr=="/getmngbinder"){
                return (
                  <Stack direction='row' spacing={2}>
                      <Button
                      variant="contained"
                      onClick={(event) => {
                        navigate('/editbinder',{state: {
                          rowObj: cellValues.row,
                        },})
                      }}
                    >
                      <EditIcon fontSize="small"/>
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(event) => {
                        navigate('/printbinder',{state: {
                          rowObj: cellValues.row,
                        },})
                      }}
                    >
                      <PrintIcon fontSize="small"/>
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(event) => {
                        navigate('/detectbinder',{state: {
                          rowObj: cellValues.row,
                        },})
                      }}
                    >
                      <WifiFindIcon fontSize="small"/>
                    </Button>
                  </Stack>
                )
              }
              else if(props.getUrlStr=="/getmnguser"){
                return (
                  <Button
                    variant="contained"
                    onClick={(event) => {
                      navigate('/modifyuser',{state: {
                        rowObj: cellValues.row,
                      },})
                    }}
                  >
                    <EditIcon fontSize="small"/>
                  </Button>
                )
              }
              //
            }
          })
        }
        
        Object.keys(ajaxData.result[0]).map((columName,i)=>{
          let tempMinWidth = columName.length*14

          if(columName=="doc_no_pattern") tempMinWidth= 300

          if(columName=="remark") tempMinWidth= 300
          if(columName=="uuid_binary") tempMinWidth= 200
          if(columName=="doc_no") tempMinWidth= 200
          if(columName=="req_purpose") tempMinWidth= 300

          if(columName=="pr_title") tempMinWidth= 300
          if(columName=="create_datetime") tempMinWidth= 200
          if(columName=="due_date") tempMinWidth= 200
          if(columName=="date_closed") tempMinWidth= 200
          if(columName=="written_by") tempMinWidth= 100

          if(columName=="doc_title") tempMinWidth= 400
          
          if(columName=="eq_name") tempMinWidth= 200
          if(columName=="eq_team") tempMinWidth= 200
          if(columName=="eq_part") tempMinWidth= 200
          if(columName=="eq_capa") tempMinWidth= 200
          if(columName=="eq_location") tempMinWidth= 240

          if(columName=="mat_name") tempMinWidth= 300

          if(columName=="qualAtt") tempMinWidth= 300
          if(columName=="valAtt") tempMinWidth= 300
          if(columName=="eqAtt") tempMinWidth= 300
          if(columName=="locAtt") tempMinWidth= 300
          if(columName=="prodAtt") tempMinWidth= 300
          if(columName=="eqmsAtt") tempMinWidth= 300
          if(columName=="relateddoc") tempMinWidth= 300
          if(columName=="isprotocol") tempMinWidth= 100

          if(columName=="binder_title") tempMinWidth= 400
          if(columName=="binder_year") tempMinWidth= 100

          if(columName=="user_team") tempMinWidth= 200
          if(columName=="req_team") tempMinWidth= 200
          if(columName=="user_email") tempMinWidth= 300
          if(columName=="user_auth") tempMinWidth= 300
          if(columName=="account_status") tempMinWidth= 300

          if (columName=="user_name"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              <Chip icon={<FaceOutlinedIcon />} size="small" color="primary" label={params.value}/>
            )})
          }
          else if (columName.indexOf("team")!=(-1)){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              params.value?<Chip icon={<Diversity3OutlinedIcon />} size="small" color="primary" label={params.value}/>:<div></div>
            )})
          }
          else if (columName=="approval_date"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              params.value?<Chip icon={<CheckCircleOutlineOutlinedIcon />} size="small" color="primary" label={params.value}/>:<div></div>
            )})
          }
          else if (columName=="invalid_date"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              params.value?<Chip icon={<UnpublishedOutlinedIcon />} size="small" color="expired" label={params.value}/>:<div></div>
            )})
          }
          else if (columName=="qualAtt"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              <div style={{display:'flex', flexWrap:'wrap'}}>{
                JSON.parse(params.value).map((oneItem,i)=>{
                  return <Tooltip title={oneItem.att_name} placement="top" arrow><Chip icon={<SettingsApplicationsOutlinedIcon />} size="small" color="primary" label={oneItem.abb}/></Tooltip>
                })
              }</div>
            )})
          }
          else if (columName=="valAtt"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              <div style={{display:'flex', flexWrap:'wrap'}}>{
                JSON.parse(params.value).map((oneItem,i)=>{
                  return <Tooltip title={oneItem.att_name} placement="top" arrow><Chip icon={<SettingsApplicationsOutlinedIcon />} size="small" color="primary" label={oneItem.abb}/></Tooltip>
                })
              }</div>
            )})
          }
          else if (columName=="eqAtt"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              <div style={{display:'flex', flexWrap:'wrap'}}>{
                JSON.parse(params.value).map((oneItem,i)=>{
                  return <Tooltip title={"("+oneItem.eq_code+" / "+ oneItem.eq_code_alt+")"} placement="top" arrow><Chip icon={<SettingsApplicationsOutlinedIcon />} size="small" color="primary" label={oneItem.eq_name}/></Tooltip>
                })
              }</div>
            )})
          }
          else if (columName=="locAtt"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              <div style={{display:'flex', flexWrap:'wrap'}}>{
                JSON.parse(params.value).map((oneItem,i)=>{
                  return <Tooltip title={oneItem.location_name} placement="top" arrow><Chip icon={<SettingsApplicationsOutlinedIcon />} size="small" color="primary" label={oneItem.location_code}/></Tooltip>
                })
              }</div>
            )})
          }
          else if (columName=="prodAtt"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, display:'flex', flexWrap:'warp', renderCell: (params) => (
              <div style={{display:'flex', flexWrap:'wrap'}}>{
              JSON.parse(params.value).map((oneItem,i)=>{
                return <Tooltip title={oneItem.mat_name} placement="top" arrow><Chip icon={<SettingsApplicationsOutlinedIcon />} size="small" color="primary" label={oneItem.mat_code}/></Tooltip>
              })
            }</div>
            )})
          }
          else if (columName=="eqmsAtt"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              <div style={{display:'flex', flexWrap:'wrap'}}>{
                JSON.parse(params.value).map((oneItem,i)=>{
                  return <Tooltip title={oneItem.project+": "+oneItem.pr_title} placement="top" arrow><Chip icon={<SettingsApplicationsOutlinedIcon />} size="small" color="primary" label={oneItem.pr_no}/></Tooltip>
                })
              }</div>
            )})
          }
          else if (columName=="relateddoc"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              <div style={{display:'flex', flexWrap:'wrap'}}>{
                JSON.parse(params.value).map((oneItem,i)=>{
                  return <Tooltip title={oneItem.doc_title} placement="top" arrow><Chip icon={<SettingsApplicationsOutlinedIcon />} size="small" color="primary" label={oneItem.doc_no+"("+oneItem.rev_no+")"}/></Tooltip>
                })
              }</div>
            )})
          }
          else if (columName=="isprotocol"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              params.value?
              (params.value==0?
                <Tooltip title={"값 : " + params.value} placement="top" arrow><Chip icon={<DescriptionOutlinedIcon />} size="small" color="primary" label={"보고서"}/></Tooltip>
              :<Tooltip title={"값 : " + params.value} placement="top" arrow><Chip icon={<DescriptionOutlinedIcon />} size="small" color="primary" label={"계획서"}/></Tooltip>)
              :<div></div>
            )})
          }
          else if (columName=="binder_loc"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              <Chip icon={<GpsFixedIcon />} size="small" color="primary" label={params.value}/>
            )})
          }
          else if (columName=="current_loc"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              params.value?
              ((params.value.indexOf("user_account")==-1)?
                <Chip icon={<GpsFixedIcon />} size="small" color="confirm" label={params.value}/>
                :<Tooltip title={"계정 : " + JSON.parse(params.value).user_account+" ("+JSON.parse(params.value).user_team+")"} placement="top" arrow><Chip icon={<GpsFixedIcon />} size="small" color="expired" label={JSON.parse(params.value).user_name+"님"}/></Tooltip>)
                :<div/>
            )})
          }
          else if (props.getUrlStr=="/getbindermovehistory"&&columName=="move_type"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              params.value=="Import"?
              <Chip icon={<GpsFixedIcon />} size="small" color="confirm" label={params.value}/>
              :(
                params.value=="Export"?
                <Chip icon={<GpsFixedIcon />} size="small" color="expired" label={params.value}/>
                :<div/>)
            )})
          }
          else if (columName=="user_company"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              <Chip icon={<EmojiTransportationIcon />} size="small" color="primary" variant="outlined" label={params.value}/>
            )})
          }
          else if (columName=="user_email"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              <Chip icon={<AlternateEmailIcon />} size="small" color="primary" variant="outlined" label={params.value}/>
            )})
          }
          else if (columName=="account_status"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              <div style={{display:'flex', flexWrap:'wrap'}}>{
                JSON.parse(params.value).map((oneItem,i)=>{
                  return <Tooltip title={oneItem.att_name} placement="top" arrow><Chip icon={<SettingsApplicationsOutlinedIcon />} size="small" color="primary" label={oneItem.abb}/></Tooltip>
                })
              }</div>
            )})
          }
          else if (columName=="user_auth"){
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1, renderCell: (params) => (
              <div style={{display:'flex', flexWrap:'wrap'}}>{
                JSON.parse(params.value).map((oneItem,i)=>{
                  return <Tooltip title={oneItem.att_name} placement="top" arrow><Chip icon={<SettingsApplicationsOutlinedIcon />} size="small" color="primary" label={oneItem.abb}/></Tooltip>
                })
              }</div>
            )})
          }
          else{
            tempCol.push({field:columName,headerName:`${columName}`,minWidth:(tempMinWidth), flex:1})
          }
        })

        

        ajaxData.result.map((oneRow,i)=>{ //ajax 데이터 중 datetime 값을 한국시간으로 변경
            let tempObjs = oneRow
            tempObjs["id"]=(i+1)
            tempObjs["action_datetime"] = moment(new Date(tempObjs["action_datetime"])).format('YYYY-MM-DD HH:mm:ss');
            tempObjs["insert_datetime"] = moment(new Date(tempObjs["insert_datetime"])).format('YYYY-MM-DD HH:mm:ss');
            tempObjs["update_datetime"] = moment(new Date(tempObjs["update_datetime"])).format('YYYY-MM-DD HH:mm:ss');

            if (tempObjs["insert_datetime"]=="1970-01-01 09:00:00") tempObjs["insert_datetime"]=""
            if (tempObjs["update_datetime"]=="1970-01-01 09:00:00") tempObjs["update_datetime"]=""


            tempObjs["create_datetime"] = moment(new Date(tempObjs["create_datetime"])).format('YYYY-MM-DD HH:mm:ss');
            tempObjs["date_closed"] = moment(new Date(tempObjs["date_closed"])).format('YYYY-MM-DD HH:mm:ss');
            tempObjs["due_date"] = moment(new Date(tempObjs["due_date"])).format('YYYY-MM-DD');

            if (tempObjs["create_datetime"]=="1970-01-01 09:00:00") tempObjs["create_datetime"]=""
            if (tempObjs["date_closed"]=="1970-01-01 09:00:00") tempObjs["date_closed"]=""
            if (tempObjs["due_date"]=="1970-01-01") tempObjs["due_date"]=""


            tempObjs["approval_date"] = moment(new Date(tempObjs["approval_date"])).format('YYYY-MM-DD');
            tempObjs["invalid_date"] = moment(new Date(tempObjs["invalid_date"])).format('YYYY-MM-DD');

            if (tempObjs["approval_date"]=="1970-01-01") tempObjs["approval_date"]=""
            if (tempObjs["invalid_date"]=="1970-01-01") tempObjs["invalid_date"]=""

            tempRow.push(tempObjs)
        })
      }
      // 컬럼 및 행 데이터 분류 종료
      setOpenBackDrop(false)
    }



    // 컬럼 및 행 데이터 분류 결과 object 형식으로 return
    return ({tempCol:tempCol, tempRow:tempRow})
  }




  //========================================================== [페이지]
  return (
    <div style={{display:'block'}}>
  {/* 테이블 데이터 ajax 시에 검색어 추가하여 요청하는 홈, 검색어 리셋, 폼 조회, 데이터 삭제(모달폼 호출), 데이터 다른 연관 테이블에 추가(모달폼 호출) 기능*/}
      <Formik
        validationSchema={schema}
        onSubmit={async (values, {resetForm})=>{
          let para = {
            searchKeyWord: values.searchKeyWord,
          }
          setIsSubmitting(true);
          let tempData = await InitialQry(para)
          setCols(tempData.tempCol)
          setRows(tempData.tempRow)
          resetForm()
          setIsSubmitting(false);
          // LoginCheck()
        }}
        initialValues={{
          searchKeyWord: ''
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
          id={props.getUrlStr}
          component="form"
          style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent:'center' }}
          noValidate
          onSubmit={handleSubmit}
          autoComplete="off"
          >
            {
            props.getUrlStr=="/getmydocno"?
            <div style={{display:'flex', marginTop:'20px', marginBottom:'4px', alignItems:'flex-start', justifyContent:'flex-start', flexGrow:1 }}>
              <Chip icon={<AddIcon/>} label="내가 받은 문서번호" color="primary"/>
            </div>
            :(props.getUrlStr=="/getmyimexbinderhistory"?
            <div style={{display:'flex', marginTop:'20px', marginBottom:'4px', alignItems:'flex-start', justifyContent:'flex-start', flexGrow:1}}>
              <Chip icon={<OpenInNewIcon/>} label="내가 반출한 바인더" color="primary"/>
            </div>
            :<div/>)
            }
            <TextField
              style={{width:'300px'}}
              required
              variant="standard"
              id="searchKeyWord"
              name="searchKeyWord"
              label="Search"
              value={values.searchKeyWord}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.searchKeyWord ? errors.searchKeyWord : ""}
              error={touched.searchKeyWord && Boolean(errors.searchKeyWord)}
              margin="dense"
              fullWidth
            />
            <div style={{display:'flex', marginTop:'20px', marginBottom:'4px',  alignItems:'flex-start'}}>
              <Button style={{marginLeft:'5px'}} size="small" variant="contained" type="submit" form={props.getUrlStr} disabled={isSubmitting}><SearchIcon/></Button>
              <Button style={{marginLeft:'5px'}} size="small" variant="outlined" type="reset" disabled={isResetting} onClick={async ()=>{
                setIsResetting(true)
                resetForm()
                InitializeTbl ()
                setIsResetting(false)
                LoginCheck()
                }}><RefreshIcon/></Button>
              <Button style={{marginLeft:'5px'}} size="small" variant="outlined" onClick={async ()=>{
                if(rowHtAuto) setRowHtAuto(false)
                else setRowHtAuto(true)
                LoginCheck()
              }}><LineWeightIcon/></Button>

              {
                props.addToListButton?
                <Button style={{marginLeft:'5px'}} disabled={!props.tblCtrl} size="small" variant="outlined" onClick={async ()=>{
                  if(pickRows.length>0){
                    setAddRowBt(addRowBt=>true)
                    setModalTitle("사용자 인증")
                    handleModalOpen()
                  }
                  else{
                    alert("항목이 선택되지 않았습니다.")
                  }
                }}><PlaylistAddIcon/></Button>:<div></div>
              }

              {
                props.deleteButton?
                <Button style={{marginLeft:'5px'}} disabled={!props.tblCtrl} size="small" variant="outlined" onClick={async ()=>{
                  if(pickRows.length>0){
                    if(props.getUrlStr=="/getmngaccount")
                    {
                      if(pickRows.length==1){
                        setDelRowBt(delRowBt=>true)
                        setModalTitle("사용자 인증")
                        handleModalOpen()
                      }
                      else{
                        alert("한 명의 사용자가 선택되어야 합니다.")
                      }
                    }
                    else
                    {
                      setDelRowBt(delRowBt=>true)
                      setModalTitle("사용자 인증")
                      handleModalOpen()
                    }
                  }
                  else{
                    alert("항목이 선택되지 않았습니다.")
                  }
                }}><DeleteForeverIcon/></Button>:<div></div>
              }

              {
                props.selectButton?
                <Button style={{marginLeft:'5px'}} disabled={!props.tblCtrl} size="small" variant="outlined" onClick={async ()=>{
                  if(props.getUrlStr=="/getgroupwareuser"){
                    if(pickRows.length==1){
                      dispatch(setSel_tb_user(pickRows[0]))
                    }
                    else
                    {
                      alert("한 명의 사용자가 선택되어야 합니다.")
                    }
                  }
                  else if(props.getUrlStr=="/adddocno_getmngdocnopattern"){   
                    dispatch(setSel_doc_pattern(pickRows))
                    dispatch(setSel_doc_pattern_cols(cols))
                  }
                  else if(props.getUrlStr=="/adddoc_getmngdocno"){
                    if(pickRows.length==1){
                      let tempRow = pickRows[0]
                      let newRevNo
                      if(!tempRow.last_rev_no&&tempRow.last_rev_no!=0) newRevNo=parseInt(pickRows[0].start_rev_no)
                      else newRevNo=(parseInt(tempRow.last_rev_no)+1)
                      console.log(newRevNo)
                      dispatch(setSel_doc_no({doc_no:tempRow.doc_no, newRevNo:newRevNo}))
                      
                    }
                    else
                    {
                      alert("한 개의 문서번호가 선택되어야 합니다.")
                    }
                  }
                  else if(props.getUrlStr=="/adddoc_getextdatatmmswholeasset"){
                    let temp = [...rdx.selTmmsWholeAsset]
                    let selRows=[]
                    pickRows.map((onePick,i)=>{
                      let dupCheck=false
                      if (temp.length>0){
                        temp.map((oneItem,j)=>{
                          if(oneItem.eq_code == onePick.eq_code) dupCheck = true
                        })
                      }
                      if (!dupCheck) selRows.push({eq_code:onePick.eq_code, eq_code_alt:onePick.eq_code_alt, eq_name:onePick.eq_name})
                    })
                    
                    temp.push.apply(temp, selRows)
                    let set = new Set(temp);
                    temp = [...set];
                    dispatch(setSelTmmsWholeAsset(temp))
                  }
                  else if(props.getUrlStr=="/adddoc_getextdatasapzmmr1010"){
                    let temp = [...rdx.selSapZmmr1010]
                    let selRows=[]
                    pickRows.map((onePick,i)=>{
                      let dupCheck=false
                      if (temp.length>0){
                        temp.map((oneItem,j)=>{
                          if(oneItem.mat_code == onePick.mat_code) dupCheck = true
                        })
                      }
                      if (!dupCheck) selRows.push({mat_code:onePick.mat_code, mat_name:onePick.mat_name })
                    })
                    
                    temp.push.apply(temp, selRows)
                    let set = new Set(temp);
                    temp = [...set];
                    dispatch(setSelSapZmmr1010(temp))
                  }
                  else if(props.getUrlStr=="/adddoc_getextdataeqmsatemplate"){
                    let temp = [...rdx.selEqmsAtemplate]
                    let selRows=[]
                    pickRows.map((onePick,i)=>{
                      let dupCheck=false
                      if (temp.length>0){
                        temp.map((oneItem,j)=>{
                          if(oneItem.pr_no == onePick.pr_no) dupCheck = true
                        })
                      }
                      if (!dupCheck) selRows.push({pr_no:onePick.pr_no, project:onePick.project, pr_title:onePick.pr_title })
                    })
                    
                    temp.push.apply(temp, selRows)
                    let set = new Set(temp);
                    temp = [...set];
                    dispatch(setSelEqmsAtemplate(temp))
                  }
                  else if(props.getUrlStr=="/adddoc_getmngdoc"){
                    let temp = [...rdx.sel_doc]
                    let selRows=[]
                    pickRows.map((onePick,i)=>{
                      let dupCheck=false
                      if (temp.length>0){
                        temp.map((oneItem,j)=>{
                          if((oneItem.doc_no == onePick.doc_no)&&(oneItem.rev_no == onePick.rev_no)) dupCheck = true
                        })
                      }
                      if (!dupCheck) selRows.push({doc_no:onePick.doc_no, rev_no:onePick.rev_no, doc_title:onePick.doc_title })
                    })
                    
                    temp.push.apply(temp, selRows)
                    let set = new Set(temp);
                    temp = [...set];
                    dispatch(setSel_doc(temp))
                  }
                  else if(props.getUrlStr=="/adddoc_getextdatatmmslocation"){
                    let temp = [...rdx.selTmmsLocation]
                    let selRows=[]
                    pickRows.map((onePick,i)=>{
                      let dupCheck=false
                      if (temp.length>0){
                        temp.map((oneItem,j)=>{
                          if(oneItem.location_code == onePick.location_code) dupCheck = true
                        })
                      }
                      if (!dupCheck) selRows.push({location_code:onePick.location_code, location_name:onePick.location_name })
                    })
                    
                    temp.push.apply(temp, selRows)
                    let set = new Set(temp);
                    temp = [...set];
                    dispatch(setSelTmmsLocation(temp))
                  }
                  else{
                    
                  }
                }}><CheckIcon/></Button>:<div></div>
              }
            </div>
          </Box>
      )}
      </Formik>
  {/* 테이블 폼 및 선택된 Row를 pickRows state에 저장할 수 있음 */}
      <div style={{ flexGrow: 1, display: 'flex', height: props.heightValue }}>
          <DataGrid
            rows={rows}
            columns={cols}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[1, 10, 20]}
            pagination
            checkboxSelection = {props.chkSel}
            getRowHeight={() => rowHtAuto?'auto':''}
            components={{ Toolbar:CustomToolbar}}
            onCellClick={(GridCellParams,event)=>{
              setClickRow(clickRow=>GridCellParams.id)
            }}
            onSelectionModelChange={(selectionModel,details)=>{
              if(props.getUrlStr=="/adddocno_getmngdocnopattern"){
                let forceSelect=[]
                selectionModel.map((oneRowId,i)=>{
                  rows.map((oneRow,j)=>{
                    if(oneRow.pattern_pair_code ==rows[oneRowId-1].pattern_pair_code){
                      forceSelect.push(oneRow.id)
                    }
                  })
                })

                forceSelect.map((oneItem,i)=>{
                  if(selectionModel.indexOf(oneItem)==(-1)){
                    selectionModel.push(oneItem)
                  }
                })
              }
              let tempPickRow=[]
              selectionModel.map((oneRowId,i)=>{
                tempPickRow.push(rows[oneRowId-1])
              })
              setPickRows(tempPickRow)
            }}
          />
        </div>
      {/* 전자서명 및 데이터 핸들링 Modal, 테이블과 같은 컴포넌트 아래 있어야 Row 데이터와 props로 전달받은 pk등 데이터를 ajax func에 전달 할 수 있음*/}
      <Modal open={openModal} onClose={handleModalClose}>
        <Paper style={modalStyle} elevation={5}>
          <Formik
            validationSchema={paperschema}
            onSubmit={async (values)=>{
            setIsModalSubmitting(true)
            setOpenModalBackDrop(true)
            let user_sign =  await axios({
              method:"get",
              url:"/signpw",
              params:{
                user_account : cookies.load('userInfo').user_account,
                user_pw : values.sign_user_pw
              },
              headers:{
                'Content-Type':'application/json'
              }})
              .then((res)=>res.data)
              .catch((err)=>console.log(err))

              if(user_sign.signStat){
                alert(user_sign.msg)
                if (props.getUrlStr=="/getmngdocnopattern"&&delRowBt)
                {
                  let reqResult = await DeleteDocNoPattern(pickRows)
                  if(!reqResult.success) alert(reqResult.result)
                  InitializeTbl ()
                  setDelRowBt(delRowBt=>false)
                }
                else if (props.getUrlStr=="/getmngdocno"&&delRowBt)
                {
                  let reqResult = await DeleteDocNo(pickRows)
                  if(reqResult.success) console.log(reqResult.result)
                  else if (reqResult.result.code.indexOf("ROW_IS_REFERENCED")!=(-1)){
                    console.log("Err No.:"+reqResult.result.errno+"\nErr Code : "+reqResult.result.code)
                    alert("선택한 데이터 중 일부가 다른 정보에서 사용하고 있어서 삭제할 수 없습니다.\n미사용 중인 데이터만 삭제 가능합니다.")
                  }
                  else alert(reqResult.result)
                  InitializeTbl ()
                  setDelRowBt(delRowBt=>false)
                }
                else if (props.getUrlStr=="/getmngdoc"&&delRowBt)
                {
                  let reqResult = await DeleteDoc(pickRows)
                  let rejectStr =""
                  if(reqResult.rejected.length>0) rejectStr="\n\n삭제 거부된 문서 : \n" +reqResult.rejected.join("\n")
                  if(reqResult.success) alert(reqResult.result.affectedRows+"개 삭제 성공" + rejectStr)
                  else alert(reqResult.result + rejectStr)
                  
                  InitializeTbl ()
                  setDelRowBt(delRowBt=>false)
                }
                else if (props.getUrlStr=="/getmngbinder"&&delRowBt)
                {
                  let reqResult = await DeleteBinder(pickRows)
                  if(!reqResult.success) alert(reqResult.result)
                  InitializeTbl ()
                  setDelRowBt(delRowBt=>false)
                }

                setOpenModalBackDrop(false)
                setIsModalSubmitting(false)
                handleModalClose()
              }
              // else if (props.getUrlStr=="/edituserauth_getuserauth"&&delRowBt)
              // {
              //   let reqResult = await DeleteUserAuth(pickRows, props.targetPk.user_account)
              //   if(!reqResult.success) alert(reqResult.result)
              //   InitializeTbl ()
              //   setDelRowBt(delRowBt=>false)
              // }
              // else if (props.getUrlStr=="/edituserauth_getusernoauth"&&addRowBt)
              // {
              //   let reqResult =  await AddUserAuth(pickRows, props.targetPk.user_account)
              //   if(!reqResult.success) alert(reqResult.result)
              //   InitializeTbl ()
              //   setAddRowBt(addRowBt=>false)
              // }
              // else if (props.getUrlStr=="/getmngaccount"&&delRowBt)
              // {
              //   let reqResult = await DeleteOneUser(pickRows[0])
              //   if(!reqResult.success) alert(reqResult.result)
              //   InitializeTbl ()
              //   setDelRowBt(addRowBt=>false)
              // }
              else{
                alert(user_sign.msg)
                setOpenModalBackDrop(false)
                setIsModalSubmitting(false)
                handleModalClose()
              }
              LoginCheck()
          }}
          initialValues={{
            sign_user_pw: ''
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
            id='userSignForm'
            component="form"
            sx={{ width: '100%', display: 'block'}}
            noValidate
            onSubmit={handleSubmit}
            autoComplete="off"
            >
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
              <Divider style={{marginTop:'5px',marginBottom:'20px'}}/>
              <div style={{display:'block', height:'470px', overflow:"auto"}}>
                {
                  delRowBt?<div style={{fontSize:'20px'}}>{pickRows.length}개의 정보가 삭제됩니다.</div>:<div></div>
                }
                {
                  addRowBt?<div style={{fontSize:'20px'}}>{pickRows.length}개의 정보가 추가됩니다.</div>:<div></div>
                }              
              </div>
              <div style={{width:'100%',display:'flex', alignItems:'center', justifyContent:'center'}}>
                <div style={{fontSize:"18px", paddingTop:'30px',}}>Account : {cookies.load('userInfo').user_account}</div>
                <div style={{width:'20%', height:"40px", marginLeft:'10px', marginRight:'10px'}}>
                  <TextField
                      size="small"
                      required
                      variant="standard"
                      id="sign_user_pw"
                      name="sign_user_pw"
                      label="USER PW"
                      value={values.sign_user_pw}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.sign_user_pw ? errors.sign_user_pw : ""}
                      error={touched.sign_user_pw && Boolean(errors.sign_user_pw)}
                      margin="dense"
                      fullWidth
                    />
                </div>
                <div style={{paddingTop:'20px',}}>
                  <Button size="small" variant="contained" type="submit" form='userSignForm' disabled={isModalSubmitting}>Confirm</Button>
                </div>
              </div>
            </Box>
          )}
          </Formik>
            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={openModalBackDrop}
            // onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Paper>
      </Modal>
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

export default MngTable

function CustomToolbar() {
  return <GridToolbarExport csvOptions={{ utf8WithBom: true }} />;
}

// async function DeleteUserAuth(pickRows, targetUser){
//   let targetRows=[]
//   pickRows.map((oneRow,i)=>{
//     targetRows.push({user_account:targetUser, user_auth:oneRow.user_auth, uuid_binary:oneRow.uuid_binary, delete_by:cookies.load('userInfo').user_account})
//   })

//   let para={
//     targetRows:targetRows
//   }
  
//   let ajaxData =  await axios({
//     method:"delete",
//     url:"/edituserauth_deleteuserauth",
//     params:para,
//     headers:{
//       'Content-Type':'application/json'
//     }})
//     .then((res)=>res.data)
//     .catch((err)=>console.log(err))
//     return ajaxData
// }


// async function AddUserAuth(pickRows, targetUser){
//   let targetRows=[]
//   pickRows.map((oneRow,i)=>{
//     targetRows.push({user_account:targetUser, user_auth:oneRow.user_auth, insert_by:cookies.load('userInfo').user_account})
//   })
//   let body={
//     targetRows:targetRows
//   }
//   let ajaxData = await axios.post("/edituserauth_adduserauth",body)
//   .then((res)=>res.data)
//   .catch((err)=>console.log(err))
//   return ajaxData 
// }

// async function DeleteOneUser(pickRows){
//   let para={
//     user_account:pickRows.user_account,
//     uuid_binary: pickRows.uuid_binary ,
//     delete_by:cookies.load('userInfo').user_account
//   }
  
//   let ajaxData =  await axios({
//     method:"delete",
//     url:"/deleteaccount",
//     params:para,
//     headers:{
//       'Content-Type':'application/json'
//     }})
//     .then((res)=>res.data)
//     .catch((err)=>console.log(err))
//     return ajaxData
// }


async function DeleteDocNoPattern(pickRows){
  let targetRows=[]
  pickRows.map((oneRow,i)=>{
    targetRows.push({doc_no_pattern:oneRow.doc_no_pattern, uuid_binary:oneRow.uuid_binary, delete_by:cookies.load('userInfo').user_account})
  })

  let para={
    targetRows:targetRows
  }
  
  let ajaxData =  await axios({
    method:"delete",
    url:"/deletedocnopattern",
    params:para,
    headers:{
      'Content-Type':'application/json'
    }})
    .then((res)=>res.data)
    .catch((err)=>console.log(err))
    return ajaxData
}

async function DeleteDocNo(pickRows){
  let targetRows=[]
  pickRows.map((oneRow,i)=>{
    targetRows.push({doc_no:oneRow.doc_no, uuid_binary:oneRow.uuid_binary, delete_by:cookies.load('userInfo').user_account})
  })

  let para={
    targetRows:targetRows
  }
  
  let ajaxData =  await axios({
    method:"delete",
    url:"/deletedocno",
    params:para,
    headers:{
      'Content-Type':'application/json'
    }})
    .then((res)=>res.data)
    .catch((err)=>console.log(err))
    return ajaxData
}

async function DeleteDoc(pickRows){
  let targetRows=[]
  pickRows.map((oneRow,i)=>{
    targetRows.push({doc_no:oneRow.doc_no, rev_no:oneRow.rev_no, doc_title:oneRow.doc_title, uuid_binary:oneRow.uuid_binary, delete_by:cookies.load('userInfo').user_account})
  })

  let para={
    targetRows:targetRows
  }
  
  let ajaxData =  await axios({
    method:"delete",
    url:"/deletedoc",
    params:para,
    headers:{
      'Content-Type':'application/json'
    }})
    .then((res)=>res.data)
    .catch((err)=>console.log(err))
    return ajaxData
}

async function DeleteBinder(pickRows){
  let targetRows=[]
  pickRows.map((oneRow,i)=>{
    targetRows.push({binder_no:oneRow.binder_no, binder_title:oneRow.binder_title, relateddoc:JSON.stringify(JSON.parse(oneRow.relateddoc)), uuid_binary:oneRow.uuid_binary, delete_by:cookies.load('userInfo').user_account})
  })

  let para={
    targetRows:targetRows
  }
  
  let ajaxData =  await axios({
    method:"delete",
    url:"/deletebinder",
    params:para,
    headers:{
      'Content-Type':'application/json'
    }})
    .then((res)=>res.data)
    .catch((err)=>console.log(err))
    return ajaxData
}