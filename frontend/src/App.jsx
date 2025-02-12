import AddCourse from "./classroom/AddCourse"
// import CourseList from "./classroom/CourseList"
// import GoogleAuth from "./classroom/LoginwithGoogle"
const handleLogin = () => {
  window.location.href = 'http://localhost:4000/auth/google';
};


const App = () => {
  return (
    <>
      <div className="login-with-google">
        <button type="submit" className="google-login-btn" onClick={handleLogin}>
          <img src="./public/google_icon.png" alt="Google Icon" className="google-icon" />
          Login with Google
        </button>
      </div>

      {/* <GoogleAuth /> */}
      <AddCourse />
      {/* <CourseList /> */}
    </>
  )
}

export default App