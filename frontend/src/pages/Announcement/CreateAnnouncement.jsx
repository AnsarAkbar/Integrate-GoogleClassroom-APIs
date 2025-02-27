import { useState } from 'react';
import './CourseAnnouncement.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Outlet } from 'react-router-dom';

const CreateAnnouncement = () => {
    const [announcement, setannouncement] = useState({
        text: '',
        link: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { courseId } = useParams();

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        navigate('/login');
    }

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log('Creating announcement:', announcement);
        

        // const formData = new FormData();
        // formData.append('text', announcement?.text);
        
        // if (announcement.materials) {
        //     formData.append('materials', announcement.materials);
        // }
            // console.log('formData |----->', formData);
        try {

            const response = await axios.post(
                    `https://classroom.googleapis.com/v1/courses/${courseId}/announcements`,
                    {
                        text: announcement?.text,
                         materials: [
                        {
                          link: {
                            url: announcement?.link,
                            title: "Study Guide"
                          }
                        }
                      ],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
            console.log('response:', response);
            console.log('announcement:', announcement);
            setannouncement({ text: '', link: null });
            setMessage('Announcement created successfully');
            navigate(`/announcement-list/${courseId}`);
        } catch (error) {
            console.error('Error creating announcement:', error);
            setMessage('Error creating announcement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="course-container">
                <h2>Create Course Announcement</h2>

                <form onSubmit={handleCreateAnnouncement} className="course-form">
                    <div className="form-group">
                        <label htmlFor="announcement">New Announcement:</label>
                        <textarea
                            type="text"
                            id="announcement"
                            name="announcement"
                            value={announcement.text}
                            onChange={(e) => setannouncement({ ...announcement, text: e.target.value })}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Link">Attach materials link</label>
                        <input
                            type="url"
                            id="materials"
                            name="materials"
                            value={announcement.link}
                            placeholder='Enter the link'
                            onChange={(e) => setannouncement({ ...announcement, link: e.target.value })}
                            className="form-input"
                        />
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Announcement'}
                    </button>
                </form>

                {message && <p>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <Outlet />
        </>
    );
};

export default CreateAnnouncement;