import { read, utils, writeFile } from 'xlsx';
import {AppBar, Divider, Input, Backdrop, CircularProgress, Stack, TextField, Paper, Box, Toolbar, Typography, Button, IconButton, Drawer, ListItemButton, ListItemIcon, ListItemText, ListItem, List} from '@mui/material/';
import BackupIcon from '@mui/icons-material/Backup';
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setLoginExpireTime } from "./../store.js"
import { useState } from 'react';
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './../Account/LoginSessionCheck.js';
import { useNavigate } from 'react-router-dom';
import { object } from 'yup';
//========================================================== axios 라이브러리 import
import axios from 'axios';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'


function ExtDataImport(){
      //========================================================== [변수, 객체 선언] 선택된 정보 redux 저장용
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();
    //========================================================== anchor Drawer state 및 변수, 렌더 페이지 선언
    let navigate = useNavigate();
    let [fileReading,setFileReading] = useState(true)
    let [isEqms,setIsEqms] = useState(true);
    let [isSap,setIsSap] = useState(true);
    let [isTmms,setIsTmms] = useState(true);

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

    const [extDataArray, setExtDataArray] = useState([]);

    const csvFileToArray = ((string) => {
      const csvHeader = string.slice(0, string.indexOf("\r\n")).split("\t");
      const csvRows = string.slice(string.indexOf("\r\n") + 1).split("\r\n");
      const array = csvRows.map((i) => {
        const values = i.split("\t")
        const obj = csvHeader.reduce((object, header, index) => {
            let tempOneValue
            if(values[index]){
                if(header=="Date Closed"||header=="작성일시"){
                    if(values[index].indexOf("PM")!=(-1)){
                      let splitDateTime = values[index].replace(' PM', '').split(" ")
                      let splitHrMin = splitDateTime[1].split(":")
                      let tempHr = parseInt(splitHrMin[0])+12
                      let tempMin = splitHrMin[1]
                      if (tempHr==24){
                        tempHr=12
                      }
                      tempOneValue=splitDateTime[0]+" "+tempHr+":"+tempMin
                    }else if(values[index].indexOf("AM")!=(-1)){
                        tempOneValue=values[index].replace(' AM', '')
                    }
                }
                else if(header=="PR ID"){
                    tempOneValue=values[index].replace('\n', '')
                }
                else{
                    tempOneValue=values[index]
                }
            }
            else{
                tempOneValue=null
            }
          object[header] = tempOneValue
          return object;
        }, {});
        return obj;
      })
      array.pop()
      setExtDataArray(extDataArray=>array);
    });
  
    function handleImport($event){
      const files = $event.target.files;
      if (files.length) {
        const file = files[0];
        const fileReader = new FileReader();
        if(file.type=="text/csv"){
          fileReader.onload = function (event) {
            const text = event.target.result;
            csvFileToArray(text);
          };
          fileReader.readAsText(file);
        }
        else{
          fileReader.onload = (event) => {
            const wb = read(event.target.result);
            const sheets = wb.SheetNames;
  
            if (sheets.length) {
                const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                setExtDataArray(extDataArray=>rows)
            }
          }
          fileReader.readAsArrayBuffer(file);
        }
      }
    }


    async function postExtDataTmms(qryBody){
        let ajaxData = await axios.post("/postextdatatmms",{extdatas:qryBody,handle_by:cookies.load('userInfo').user_account})
        .then((res)=>res.data)
        .catch((err)=>{
          console.log(err)
        })
    
        if(ajaxData.success) return ajaxData.result
        else alert(ajaxData)
        
    }

    async function postExtDataSapZmmr1010(qryBody){
        let ajaxData = await axios.post("/postextdatasapzmmr1010",{extdatas:qryBody,handle_by:cookies.load('userInfo').user_account})
        .then((res)=>res.data)
        .catch((err)=>{
          console.log(err)
        })
    
        if(ajaxData.success) return ajaxData.result
        else alert(ajaxData)
        
    }

    async function postExtDataEqmsAtemplate(qryBody){
        let ajaxData = await axios.post("/postextdataeqmsatemplate",{extdatas:qryBody,handle_by:cookies.load('userInfo').user_account})
        .then((res)=>res.data)
        .catch((err)=>{
          console.log(err)
        })
    
        if(ajaxData.success) return ajaxData.result
        else alert(ajaxData)
        
    }
    
    return(
        <div style={{width:'100vw', display:'flex', flexWrap:'wrap' ,justifyContent:'center', alignItems:'center'}}>
            <Paper style={{width:'48vw', minWidth : '300px', height:'360px', padding:'10px', margin:'0.5vw', overflowY:'auto', boxSizing:'border-box'}} elevation={3}>
                <Stack spacing={2}>
                    <div style={{width:'100%', display:'flex', alignItems:'center'}}>
                        <BackupIcon color="primary"/>
                        <div style={{flexGrow:1, fontWeight:'bold', marginLeft:'4px'}}>외부 시스템 데이터 업로드</div>
                    </div>
                    <div style={{width:'100%', display:'flex'}}>
                        <div style={{flexGrow:1, marginRight:'4px'}}>
                            <TextField type="file" name="file" id="inputGroupFile" size="small" color="primary" fullWidth onChange={async (e)=>{
                                LoginCheck()
                                setIsEqms(true);
                                setIsSap(true);
                                setIsTmms(true);
                                handleImport(e)
                                setFileReading(false)
                            }} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                        </div>
                        <Button disabled={fileReading} variant="contained" size="small" color="primary" onClick={()=>{
                            LoginCheck()
                            if(Object.keys(extDataArray[0]).length==83){
                                setIsEqms(true);
                                setIsSap(false);
                                setIsTmms(true);
                            }
                            else if(Object.keys(extDataArray[0]).length==24){
                                setIsEqms(true);
                                setIsSap(true);
                                setIsTmms(false);
                            }
                            else if(Object.keys(extDataArray[0]).length==8){
                                setIsEqms(false);
                                setIsSap(true);
                                setIsTmms(true);
                            }
                            setFileReading(true)
                            }}>식별</Button>
                    </div>
                    <Button style={{ display: "block", textAlign: "center" }} disabled={isEqms} variant="contained" size="small" color="primary" onClick={async ()=>{
                        LoginCheck()
                        console.log (await postExtDataEqmsAtemplate(extDataArray))
                        }}>
                        <Typography variant="button">eQMS Data</Typography>
                        <Typography variant="body2">{"(Teamplate : A:공통)"}</Typography>
                    </Button>
                    <Button style={{ display: "block", textAlign: "center" }} disabled={isSap} variant="contained" size="small" color="primary" onClick={async ()=>{
                        LoginCheck()
                        console.log (await postExtDataSapZmmr1010(extDataArray))
                        }}>
                        <Typography variant="button">SAP Data</Typography>
                        <Typography variant="body2">{"(Report form : ZMMR1010)"}</Typography>
                    </Button>
                    <Button style={{ display: "block", textAlign: "center" }} disabled={isTmms} variant="contained" size="small" color="primary" onClick={async ()=>{
                        LoginCheck()
                        console.log (await postExtDataTmms(extDataArray))
                        }}>
                        <Typography variant="button">TMMS Data</Typography>
                        <Typography variant="body2">{"(from : 설비자산>전체마스터)"}</Typography>
                    </Button>
                </Stack>
            </Paper>
        </div>
    )
}

export default ExtDataImport