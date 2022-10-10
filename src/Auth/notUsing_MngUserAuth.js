
//========================================================== React 라이브러리 import
import * as React from 'react';
import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
//========================================================== Material UI 라이브러리 import
import {PropTypes, Tabs, Tab, Box, Typography, Chip, Button, Stack, Paper,Divider,Modal, Checkbox, ListItemIcon, ListItemText, ListItem, CardHeader, Card, List, Grid} from '@mui/material/';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import PostAddIcon from '@mui/icons-material/PostAdd';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setSel_tb_user,setLoginExpireTime } from "./../store.js"
//========================================================== MngTable 컴포넌트 import
import MngTable from './../MngTable/MngTable'
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './../Account/LoginSessionCheck.js';

function MngUserAuth() {
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
    height:'600px',
    overflow:'auto',
    padding:'20px'
  };


  let [refresh,setRefresh] = useState(false);

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
      <Stack style={{padding:'10px'}} direction='row' spacing={2}>
          <Paper style={{width:'25%', padding:'20px', marginLeft:'10px',marginRight:'10px', minHeight:'650px', overflowY:'auto', boxSizing:'border-box'}} elevation={3}>
            <Stack spacing={2}>
              <div style={{display:'flex', alignContent:'center'}}>
                <div style={{fontSize:"3.2vw"}}>
                  <AccountCircleIcon fontSize ="inherit" color="primary"/>
                </div>
                <div style={{display:'block',  width:"70%", alignContent:'center',paddingLeft:'1vw'}}>
                  <div className="fontbig">{rdx.sel_tb_user.user_name}</div>
                  <div className="fontnormal">{rdx.sel_tb_user.user_account}</div>
                </div>
                <div style={{display: "flex", justifyContent: "flex-end", width:"18%"}}>
                  <Button size="small" variant="contained" onClick={()=>{
                    setModalTitle("계정 선택")
                    handleModalOpen()
                    setRefresh(false)
                    LoginCheck()
                    }}>선택</Button>
                </div>
              </div>
              <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                <div className='info-item'>직책</div>
                <div className='info-item-content'>{rdx.sel_tb_user.user_position}</div>
              </Stack>
              <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                <div className='info-item'>팀</div>
                <div className='info-item-content'>{rdx.sel_tb_user.user_team}</div>
              </Stack>
              <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                <div className='info-item'>회사</div>
                <div className='info-item-content'>{rdx.sel_tb_user.user_company}</div>
              </Stack>
              <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                <div className='info-item'>E-Mail</div>
                <div className='info-item-content'>{rdx.sel_tb_user.user_email}</div>
              </Stack>
              <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                <div className='info-item'>전화</div>
                <div className='info-item-content'>{rdx.sel_tb_user.user_phone}</div>
              </Stack>
              <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                <div className='info-item'>비고</div>
                <div className='info-item-content'>{rdx.sel_tb_user.remark}</div>
              </Stack>
              <Stack direction='row' divider={<Divider style={{marginLeft:'1vw',marginRight:'1vw'}} orientation="vertical" flexItem />}>
                <div className='info-item'>UUID</div>
                <div className='info-item-content'>{rdx.sel_tb_user.uuid_binary}</div>
              </Stack>
              <Button size="small" variant="contained" onClick={async ()=>{
                setRefresh(true)
                LoginCheck()
                }}>Confirm</Button>
            </Stack>
          </Paper>
        <Paper style={{width:'75%', padding:'20px', marginLeft:'10px',marginRight:'10px', minHeight:'650px', overflowY:'auto', boxSizing:'border-box'}} elevation={3}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="My Page Tabs">
                <Tab icon={<PostAddIcon/>} label="권한관리" {...a11yProps(0)} />
              </Tabs>
            </Box>
              <TabPanel value={value} index={0}>
                <Stack spacing={2}>
                  {
                    refresh?<MngTable getUrlStr={'/edituserauth_getusernoauth'} targetPk={{user_account:rdx.sel_tb_user.user_account}} heightValue={600} tblCtrl={true} chkSel={true} deleteButton={false} addToListButton={true} editable={false} selectButton={false}/>:<div></div>
                  }
                  {
                    refresh?<MngTable getUrlStr={'/edituserauth_getuserauth'} targetPk={{user_account:rdx.sel_tb_user.user_account}} heightValue={600} tblCtrl={true} chkSel={true} deleteButton={true} addToListButton={false} editable={false} selectButton={false}/>:<div></div>
                  }
                </Stack>
            </TabPanel>
          </Box>
        </Paper>
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
                  <MngTable getUrlStr={'/edituserauth_getuser'} targetPk={{}} heightValue={480} tblCtrl={true} chkSel={false} deleteButton={false} addToListButton={false} editable={false} selectButton={true}/>
                </div>
              </div>
            </Paper>
          </Modal>
      </Stack>
  );
}

export default MngUserAuth