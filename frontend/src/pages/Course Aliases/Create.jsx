import { useEffect, useState } from 'react';
import '../Announcement/CourseAnnouncement.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import useApi from '../../utils/api';

const Create = () => {
    const [alias, setAlias] = useState({
        alias: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { courseId } = useParams();
    const { apiRequest }=useApi();


    const validateAlias = (alias) => {
        const aliasPattern = /^d:[a-z0-9-]+$/;
        return aliasPattern.test(alias);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (!validateAlias(alias.alias)) {
            setError('Invalid alias format. Alias must start with "d:" followed by lowercase letters, numbers, and dashes.');
            setLoading(false);
            return;
        }
    
        try {
            apiRequest(`https://classroom.googleapis.com/v1/courses/${courseId}/aliases`, 'POST', {
                alias: alias.alias,
            });
            // console.log('Response:', response.data);
            setAlias({ alias: '' });
            setMessage('Course alias created successfully');
            navigate(`/course-aliases/${courseId}`);
        } catch (error) {
            console.error('Error creating course alias:', error.response?.data || error.message);
            setMessage('Error creating course alias: ' + (error.response?.data?.error?.message || error.message));
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="course-container">
                <h2>Create Course Alias</h2>

                <form onSubmit={handleSubmit} className="course-form">
                    <div className="form-group">
                        <label htmlFor="alias">Course Alias:</label>
                        <input
                            type="text"
                            id="alias"
                            name="alias"
                            value={alias.alias}
                            onChange={(e) => setAlias({ alias: e.target.value })}
                            required
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        Create Alias
                    </button>
                </form>

                {message && <p>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <Outlet />
        </>
    );
};

export default Create;