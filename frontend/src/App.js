import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import { getAllUsers, loadUser } from './actions/userAction';
import Home from './components/Home/Home';
import Account from './components/account/Account';
import NewPost from './components/NewPost/NewPost';
import Register from "./components/Register/Register";
import UpdateProfile from "./components/UpdateProfile/UpdateProfile";
import UpdatePassword from './components/UpdatePassword/UpdatePassword';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import UserProfile from './components/UserProfile/UserProfile';
import Search from './components/Search/Search';
import PostDetail from './components/PostDetail/PostDetail';

function App() {
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector(state=>state.user);

  useEffect(() => {
    dispatch(loadUser());
    dispatch(getAllUsers());
  }, [dispatch]);
  
  return (    
    <Router>
        {isAuthenticated &&  <Header/>}
        <Routes>
          <Route exact path='/' element={isAuthenticated ? <Home/> : <Login/>} />
          <Route exact path='/register' element={isAuthenticated ? <Home/> : <Register/>} />
          <Route exact path='/account' element={isAuthenticated ? <Account/> : <Login/>} />
          <Route exact path='/newpost' element={isAuthenticated ? <NewPost/> : <Login/>} />
          <Route exact path='/update/profile' element={isAuthenticated ? <UpdateProfile/> : <Login/>} />
          <Route exact path='/update/password' element={isAuthenticated ? <UpdatePassword/> : <Login/>} />
          <Route exact path='/forgot/password' element={isAuthenticated ? <UpdatePassword/> : <ForgotPassword/>} />
          <Route exact path='/password/reset/:token' element={isAuthenticated ? <UpdatePassword/> : <ResetPassword/>} />
          <Route exact path='/user/:id' element={isAuthenticated ? <UserProfile/> : <Login/>} />
          <Route exact path='/search' element={isAuthenticated ? <Search/> : <Login/>} />
          <Route exact path='/post/:postId' element={isAuthenticated ? <PostDetail/> : <Login/>} />
        </Routes>
    </Router>
  );
}

export default App;
