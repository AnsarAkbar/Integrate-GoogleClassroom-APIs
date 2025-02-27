import { useState, useEffect } from 'react';
import axios from 'axios';
import './List.css';
import { NavLink, useNavigate } from 'react-router-dom';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
        navigate('/login');
    }

    useEffect(() => {
        if (!accessToken) {
            setError('Please log in first');
            setLoading(false);
            return;
        } else {
            setError('');
        }

        const fetchCourses = async () => {
            try {
                const response = await axios.get(
                    'https://classroom.googleapis.com/v1/courses',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setCourses(response.data.courses || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setError('Failed to fetch courses');
                setLoading(false);
            }
        };

        fetchCourses();
    }, [accessToken]);

    const handleDelete = async (courseId) => {
        try {
            await axios.delete(
                `https://classroom.googleapis.com/v1/courses/${courseId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setCourses(courses.filter(course => course.id !== courseId));
        } catch (error) {
            console.error('Error while deleting courses:', error);
        }
    };

    const handleEdit = (course) => {
        navigate(`/edit-course/${course.id}`);
    };

    if (loading) {
        return <p>Loading courses...</p>;
    }

    if (error) {
        return <p style={{ color: 'red', maxWidth: '1200px', margin: '0 auto' }}>{error}</p>;
    }

    if (courses.length === 0) {
        return <p style={{ maxWidth: '1200px', margin: '0 auto' }}>No courses found.</p>;
    }

    return (
        <div className="course-list">
            <NavLink to="/create-course" className="add-course-btn">Add Course</NavLink>
            <h2 className="heading">Active Courses</h2>

            {/* Display message when no active courses */}
            {courses.filter(course => course.courseState === 'ACTIVE').length === 0 ? (
                <p className="no-courses" >No active courses available.</p>
            ) : (
                <ul className="course-list-items">
                    {courses.map((course) =>
                        course.courseState === 'ACTIVE' && (
                            <li key={course.id} className="course-card">
                                <div className="course-details">
                                    <h3 className="course-title">{course.name}</h3>
                                    <p className="course-section">Section: {course.section}</p>
                                    <p className="course-description">{course.description}</p>
                                    <p className="course-id">Course ID: {course.id}</p>
                                </div>
                                <div className="course-actions">
                                    <div>
                                        <button
                                            className="edit-btn"
                                            onClick={() => navigate(`/course-aliases/${course.id}`)}
                                        >
                                            Edit Title
                                        </button>
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(course)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(course.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <button
                                        className="create-announcement-btn"
                                        onClick={() => navigate(`/create-announcement/${course?.id}`)}
                                    >create announcement</button>
                                </div>
                            </li>
                        )
                    )}
                </ul>
            )}
        </div>
    );
};

export default CourseList;
