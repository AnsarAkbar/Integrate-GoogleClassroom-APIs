// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const CourseList = () => {
//     const [courses, setCourses] = useState([]);
//     console.log('courses',courses)
//     useEffect(() => {
//         axios.get('http://localhost:4000/courses')
//             .then(response => console.log('response',response))
//             .catch(error => console.error(error));
//     }, []);

//     return (
//         <div>
//             <h1>Courses</h1>
//             <ul>
//                 {courses.map(course => (
//                     <li key={course.id}>{course.name}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default CourseList;