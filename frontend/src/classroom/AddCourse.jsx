import { useState } from 'react';
import axios from 'axios';
import './AddCourse.css'; // Adjust path accordingly

const AddCourse = () => {
    const [course, setCourse] = useState({
        name: '',
        section: '',
        description: '',
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse({
            ...course,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Show loading state

        try {
            const response = await axios.post('http://localhost:4000/courses', course, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true, // Include credentials (cookies)
            });

            setMessage('Course created successfully!');
            console.log('Response:', response.data);
        } catch (error) {
            setMessage('Failed to create course. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false); // Hide loading state
        }
    };

    return (
        <div className="add-course-container">
            <h2>Add a New Course</h2>
            <form onSubmit={handleSubmit} className="course-form">
                <div className="form-group">
                    <label htmlFor="name">Course Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={course.name}
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
                        value={course.section}
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
                        value={course.description}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Course'}
                </button>
            </form>
            {message && <p className={`message ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>}
        </div>
    );
};

export default AddCourse;
