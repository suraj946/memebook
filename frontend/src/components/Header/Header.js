import React, {Fragment, useState} from 'react';
import "./Header.css";
import { Link } from 'react-router-dom';
import { 
    Home, 
    HomeOutlined,
    Add,
    AddOutlined,
    Search,
    SearchOutlined,
    AccountCircle,
    AccountCircleOutlined,
    MailOutlined,
    Mail
} from "@mui/icons-material";

const Header = () => {
    const [tab, setTab] = useState(window.location.pathname);
  return (
    <Fragment>
        <div className='header'>
            <div className="links">
                <Link to="/" onClick={()=>{setTab("/")}}>
                    {tab === "/" ? <Home style={{color:"black"}}/> : <HomeOutlined/>}
                </Link>
                <Link to="/newpost" onClick={()=>{setTab("/newpost")}}>
                    {tab === "/newpost" ? <Add style={{color:"black"}}/> : <AddOutlined/>}
                </Link>
                <Link to="/chats" onClick={()=>{setTab("/chats")}}>
                    {tab === "/chats" ? <Mail style={{color:"black"}}/> : <MailOutlined/>}
                </Link>
                <Link to="/search" onClick={()=>{setTab("/search")}}>
                    {tab === "/search" ? <Search style={{color:"black"}}/> : <SearchOutlined/>}
                </Link>
                <Link to="/account" onClick={()=>{setTab("/account")}}>
                    {tab === "/account" ? <AccountCircle style={{color:"black"}}/> : <AccountCircleOutlined/>}
                </Link>
            </div>
        </div>
        <div className='forMargin'></div>
    </Fragment>
  )
}

export default Header