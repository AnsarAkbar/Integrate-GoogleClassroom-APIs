import { useState, useEffect } from "react";
import AddCourse from "./pages/Course/Create";
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CourseList from "./pages/Course/List";
import AnnouncementList from "./pages/Announcement/AnnouncementList";
import CreateAnnouncement from "./pages/Announcement/CreateAnnouncement";
import EditAnnouncement from "./pages/Announcement/EditAnnouncement";
import Create from "./pages/Course Aliases/Create";
import CourseAliasList from "./pages/Course Aliases/CourseAliasList";
import Login from "./pages/login/Login";
import Edit from "./pages/Course/Edit";

const App = () => {
  

  // const handleLogin = () => {
  //   window.location.href = 'http://localhost:4000/auth/google';
  // };

  // useEffect(() => {
  //   debugger;
  //   const token = new URLSearchParams(window.location.search).get('access_token');
  //   console.log('token:', token);
    
  //   if (token) {
  //     localStorage.setItem('accessToken', token); 
  //     // window.history.replaceState({}, document.title, window.location.pathname);
  //   }
  // }, []);

  return (
    <>
    <Router>
        <Routes>
          <Route path="/" element={<CourseList />} />
          <Route path="/create-course" element={<AddCourse />} />
          <Route path="/edit-course/:courseId" element={<Edit />} />
          <Route path="/create-announcement/:courseId" element={<CreateAnnouncement />} />
          <Route path="/announcement-list/:courseId" element={<AnnouncementList />} />
          <Route path="/edit-announcement/:courseId/:announcementId" element={<EditAnnouncement />} />
          <Route path="/course-aliases/:courseId" element={<Create />} />
          <Route path=" /course-aliases/:courseId" element={<CourseAliasList />} />
          <Route path="*" element={<h1>Not Found</h1>} />        
          <Route path="/login" element={<Login />} />  
        </Routes>
      </Router>
    </>
  );
};

export default App;
