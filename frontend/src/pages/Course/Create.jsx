import { useState } from 'react';
import axios from 'axios';
import './Create.css';
import CourseList from './List';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
    const [courseData, setCourseData] = useState({
        name: '',
        section: '',
        description: '',
        ownerId: 'me',
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            let response;
            if (isEditing) {
                response = await updateCourse(courseData.id);
            } else {
                response = await createCourse();
            }

            if (response?.data?.id) {
                setMessage(isEditing ? 'Course updated successfully' : 'Course created successfully');
            }
        } catch (error) {
            setMessage(`Error processing course: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const createCourse = async () => {
        try {
            const response = await axios.post('https://classroom.googleapis.com/v1/courses', courseData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.status === 200) {
                setMessage('Course created successfully');
                setCourseData({
                    name: '',
                    section: '',
                    description: '',
                });
                navigate(`/`);
            }

          
            // if (response.status === 200) {
            //     const patchResponse = await axios.patch(
            //         `https://classroom.googleapis.com/v1/courses/${response.data.id}`,
            //         { courseState: 'ACTIVE' },
            //         {
            //             headers: { Authorization: `Bearer ${accessToken}` },
            //             params: { updateMask: 'courseState' },
            //         }
            //     );

            //     if (patchResponse.status === 200) {
            //         setMessage('Course created and activated successfully');
            //     } else {
            //         setMessage('Course created, but failed to activate');
            //     }
            // }

            return response;
        } catch (error) {
           
            setMessage(`Error during course creation: ${error.message}`);
            throw error;
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
                <h2>{isEditing ? 'Edit Course' : 'Add a New Course'}</h2>
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
                        {isLoading ? 'Processing...' : isEditing ? 'Update Course' : 'Create Course'}
                    </button>
                </form>
                {message && <p className={`message ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>}
            </div>
            <CourseList setCourseData={setCourseData} setIsEditing={setIsEditing} />
        </>
    );
};

export default AddCourse;
