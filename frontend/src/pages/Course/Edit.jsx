import { useEffect, useState } from 'react';
import axios from 'axios';
import './Create.css';
import { useNavigate, useParams } from 'react-router-dom';

const Edit = () => {
    const [courseData, setCourseData] = useState({
        name: '',
        section: '',
        description: '',
        ownerId: 'me',
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { courseId } = useParams();
    const navigate = useNavigate();

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        navigate('/login');
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData({
            ...courseData,
            [name]: value,
        });
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(
                    `https://classroom.googleapis.com/v1/courses/${courseId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setCourseData(response.data);
            } catch (error) {
                console.error('Error fetching course:', error);
                setMessage('Failed to fetch course');
            }
        };
        fetchCourse();
    }, [accessToken, courseId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await updateCourse(courseId);

            if (response?.data?.id) {
                setMessage('Course updated successfully');
            }
            navigate('/');
        } catch (error) {
            setMessage(`Error updating course: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const updateCourse = async (courseId) => {
        try {
            const response = await axios.put(
                `https://classroom.googleapis.com/v1/courses/${courseId}`,
                courseData,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            return response;
        } catch (error) {
            setMessage(`Error updating course: ${error.message}`);
            throw error;
        }
    };

    return (
        <>
            <div className="add-course-container">
                <h2>Edit Course</h2>
                <form onSubmit={handleSubmit} className="course-form">
                    <div className="form-group">
                        <label htmlFor="name">Course Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={courseData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="section">Section:</label>
                        <input
                            type="text"
                            id="section"
                            name="section"
                            value={courseData.section}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={courseData.description}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Update Course'}
                    </button>
                </form>
                {message && <p className={`message ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>}
            </div>
        </>
    );
};

export default Edit;