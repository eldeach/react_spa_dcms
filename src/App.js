import './App.css';
//========================================================== React 라이브러리 import
import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

//========================================================== Material UI 라이브러리 import
import {AppBar, Divider, Box, Toolbar, Typography, Button, IconButton, Drawer, ListItemButton, ListItemIcon, ListItemText, ListItem, List} from '@mui/material/';
//----------------------------------------------------------- Material UI 라이브러리 (Icon) import
import MenuIcon from '@mui/icons-material/Menu';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RuleIcon from '@mui/icons-material/Rule';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
//========================================================== axios 라이브러리 import
import axios from 'axios';
//========================================================== cookie 라이브러리 import
import cookies from 'react-cookies'
//========================================================== Slide Popup 컴포넌트 & Redux import
import { useDispatch, useSelector } from "react-redux"
import { setLoginExpireTime } from "./store.js"
//========================================================== 라우트할 import
import UserLogin from './Account/UserLogin';

import MngAccount from './Account/MngAccount';
import AddAccount from './Account/AddAccount';
import EditAccount from './Account/EditAccount';
import MngUserAuth from './Auth/MngUserAuth';

import AddDocNo from './MngDoc/AddDocNo'
import MngDocNo from './MngDoc/MngDocNo'
import AddDocNo_clone from './MngDoc/AddDocNo_clone'

import AddDoc from './MngDoc/AddDoc'
import MngDoc from './MngDoc/MngDoc'
import AddDoc_clone from './MngDoc/AddDoc_clone'

import AddDocNoPattern from './MngDoc/AddDocNoPattern'
import MngDocNoPattern from './MngDoc/MngDocNoPattern'

import AuditTrail from './SystemPage/AuditTrail'
import ImportTmmsWholeAsset from './ExtData/ImportTmmsWholeAsset'
import ExtDataImport from './ExtData/ExtDataImport'
import MyPage from './Account/MyPage';
//========================================================== 로그인 세션 확인 및 쿠키 save 컴포넌트 import
import LoginSessionCheck from './Account/LoginSessionCheck.js';
import LoginTimer from './Account/LoginTimer';
//========================================================== 반응형 웹
import { BrowserView, MobileView } from 'react-device-detect';

import { createTheme , ThemeProvider} from '@mui/material/styles';
import { RedoSharp } from '@mui/icons-material';




const theme = createTheme({
  palette: {
    primary: {
      light: '#6ec6ff',
      main: '#2196f3',
      dark: '#0069c0',
      contrastText: '#fff',
    },
    secondary: {
      light: '#b2fef7',
      main: '#80cbc4',
      dark: '#4f9a94',
      contrastText: '#000000',
    },
    loginTimer:{
      light: '#ffffff',
      main: '#ffffff',
      dark: '#ffffff',
      contrastText: '#ffffff',
    },
    expired:{
      light: '#ff5c8d',
      main: '#d81b60',
      dark: '#a00037',
      contrastText: '#ffffff',
    }
  },
});



function App() {

  window.addEventListener('beforeunload', (e)=>{
    axios.get("/logout").then((res)=>{}).catch((err)=>console.log(err))
    cookies.remove('loginStat', {path :'/',})
    cookies.remove('userInfo', {path :'/',})
    dispatch(setLoginExpireTime(0))
  });
  
  //========================================================== [변수, 객체 선언] 선택된 정보 redux 저장용
  let rdx = useSelector((state) => { return state } )
  let dispatch = useDispatch();
  //========================================================== [변수, 객체 선언] useLocation

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

  //========================================================== anchor Drawer state 및 변수, 렌더 페이지 선언
  let navigate = useNavigate();
  let [pageName,setPageName]=useState();

  let [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  let toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  let anchor = 'left'

  let list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{
            LoginCheck()
            navigate("/mypage")
            }}>
            <ListItemIcon>
              <AccountCircleIcon color="primary"/> 
            </ListItemIcon>
            <ListItemText primary={cookies.load('loginStat') ? cookies.load('userInfo').user_name : ""} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{
            LoginCheck()
            navigate("/mngdocnopattern")
            }}>
            <ListItemIcon>
              <RuleFolderIcon color="primary"/> 
            </ListItemIcon>
            <ListItemText primary={"문서번호 패턴 관리"} />
          </ListItemButton>
        </ListItem>
       <ListItem disablePadding>
          <ListItemButton onClick={()=>{
            LoginCheck()
            navigate("/adddocnopattern")
            }}>
            <ListItemIcon>
              <RuleIcon color="primary"/> 
            </ListItemIcon>
            <ListItemText primary={"문서번호 패턴 추가"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{
            LoginCheck()
            navigate("/mngdocno")
            }}>
            <ListItemIcon>
              <FormatListNumberedIcon color="primary"/> 
            </ListItemIcon>
            <ListItemText primary={"문서번호 관리"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{
            LoginCheck()
            navigate("/adddocno")
            }}>
            <ListItemIcon>
              <AddIcon color="primary"/> 
            </ListItemIcon>
            <ListItemText primary={"문서 번호 추가"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />  
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{
            LoginCheck()
            navigate("/mngdoc")
            }}>
            <ListItemIcon>
              <InventoryIcon color="primary" /> 
            </ListItemIcon>
            <ListItemText primary={"문서정보 관리"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{
            LoginCheck()
            navigate("/adddoc")
            }}>
            <ListItemIcon>
              <PostAddIcon color="primary"/> 
            </ListItemIcon>
            <ListItemText primary={"문서정보 추가"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />  
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{
            LoginCheck()
            navigate("/mngdocno")
            }}>
            <ListItemIcon>
              <FolderIcon color="primary"/> 
            </ListItemIcon>
            <ListItemText primary={"바인더 인벤토리"} />
          </ListItemButton>
        </ListItem>
      </List>   
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{
            LoginCheck()
            navigate("/addaccount")
            }}>
            <ListItemIcon>
              <PersonAddIcon /> 
            </ListItemIcon>
            <ListItemText primary={"계정추가"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{
            LoginCheck()
            navigate("/mngaccount")
            }}>
            <ListItemIcon>
              <SupervisorAccountIcon /> 
            </ListItemIcon>
            <ListItemText primary={"계정관리"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{
            LoginCheck()
            navigate("/mnguserauth")
            }}>
            <ListItemIcon>
              <PostAddIcon /> 
            </ListItemIcon>
            <ListItemText primary={"유저권한관리"} />
          </ListItemButton>
        </ListItem>
      </List> 
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{
            LoginCheck()
            navigate("/audittrail")
            }}>
            <ListItemIcon>
              <ManageSearchIcon color="primary"/> 
            </ListItemIcon>
            <ListItemText primary={"Audit Trail"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{
            LoginCheck()
            navigate("/importtmmswholeasset")
            }}>
            <ListItemIcon>
              <ManageSearchIcon /> 
            </ListItemIcon>
            <ListItemText primary={"Ext. TMMS DATA"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{
            LoginCheck()
            navigate("/extdataimport")
            }}>
            <ListItemIcon>
              <ManageSearchIcon /> 
            </ListItemIcon>
            <ListItemText primary={"Ext. Data Import"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <ThemeProvider theme={theme}>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
              <Toolbar>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={toggleDrawer(anchor, true)}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Drawer
                    anchor={anchor}
                    open={state[anchor]}
                    onClose={toggleDrawer(anchor, false)}
                  >
                    {list(anchor)}
                  </Drawer>
                  {/* <div style={{fontWeight:'bold', flexGrow: 1, overflow:'hidden'}}>DCMS</div> */}
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1, overflow:'hidden' }}>
                    DCMS
                  </Typography>
                {
                  cookies.load('loginStat') ? 
                  <div style={{marginLeft:'6px' }}>
                    <LoginTimer/>
                  </div>
                  :null
                }
                {
                  cookies.load('loginStat') ? 
                  <Button style={{marginLeft:'6px'}} size="small" color="inherit" onClick={()=>{
                    LoginCheck()
                  }}>Extend Login</Button>
                  :null
                }
                <Button style={{marginLeft:'6px'}} size="small" color="inherit" onClick={()=>{
                  axios.get("/logout")
                  .then((res)=>{
                    cookies.remove('loginStat', {path :'/',})
                    cookies.remove('userInfo', {path :'/',})
                    dispatch(setLoginExpireTime(0))
                    navigate("/userlogin")
                  })
                  .catch((err)=>{
                    console.log(err)
                  })
                  }}>{cookies.load('loginStat') ? "LOGOUT" : "LOGIN"}</Button>
              </Toolbar>
            </AppBar>
          </Box>
          <div style={{height:'70px'}}>Appbar is here</div>

          <Routes>
            <Route path='/' element={<div>home</div>}/>
            <Route path='/addaccount' element={<AddAccount/>}/>
            <Route path='/mngaccount' element={<MngAccount/>}/>
            <Route path='/editaccount' element={<EditAccount/>}/>
            <Route path='/mnguserauth' element={<MngUserAuth/>}/>

            <Route path='/adddocnopattern' element={ <AddDocNoPattern/>  }/>
            <Route path='/mngdocnopattern' element={ <MngDocNoPattern/> }/>
            <Route path='/editdocnopattern' element={ <div>editdocnopattern</div> }/>

            <Route path='/adddocno' element={ <AddDocNo/> }/>
            <Route path='/mngdocno' element={ <MngDocNo/> }/>
            <Route path='/editdocno' element={ <AddDocNo_clone/> }/>

            <Route path='/adddoc' element={<AddDoc/>}/>
            <Route path='/mngdoc' element={ <MngDoc/> }/>
            <Route path='/editdoc' element={<AddDoc_clone/>}/>
            
            <Route path='/audittrail' element={ <AuditTrail/> }/>
            
            <Route path='/importtmmswholeasset' element={ <ImportTmmsWholeAsset/> }/>
            <Route path='/extdataimport' element={ <ExtDataImport/> }/>

            <Route path='/mypage' element={ <MyPage />}/>
            <Route path='/userlogin' element={<UserLogin/>}/>
            <Route path='/login' element={<UserLogin/>}/>
          </Routes>

      </ThemeProvider>
    </div>
  );
}

export default App;