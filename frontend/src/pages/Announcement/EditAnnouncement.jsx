import { useEffect, useState } from 'react';
import './CourseAnnouncement.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import useApi from '../../utils/api';

const EditAnnouncement = () => {
    const [announcement, setannouncement] = useState({
        text: '',
        // link: '',

    });
    console.log('announcement', announcement);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const { courseId, announcementId } = useParams();
    const { apiRequest } = useApi();

    

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiRequest(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements/${announcementId}?updateMask=text`, 'PATCH', {
                text: announcement.text,
                // materials: [
                //     {
                //         link: {
                //             url: announcement.link,
                //             title: 'Study Guide',
                //         },
                // ],
            });
            setannouncement({ text: '', link: '' });
            setMessage('Announcement updated successfully');
            navigate(`/announcement-list/${courseId}`);
        } catch (error) {
            console.error('Error updating announcement:', error);
            setMessage('Error updating announcement');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const response = await apiRequest(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements/${announcementId}`)

                setannouncement({ text: response.data.text })
                // setannouncement({ text: response.data.text, link: `${response.data.materials ? response.data.materials[0].link.url : ''}` });
            } catch (error) {
                console.error('Error fetching announcement:', error);
                setError('Error fetching announcement');
            }
        };

        fetchAnnouncement();
    }
        , [courseId, announcementId]);


    return (
        <>
            <div className="course-container">
                <h2>Update Course Announcement</h2>

                <form onSubmit={handleSubmit} className="course-form">
                    <div className="form-group">
                        <label htmlFor="announcement">Update Announcement:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={announcement.text}
                            onChange={(e) => setannouncement({ text: e.target.value })}
                            required
                            className="form-input"
                        />
                    </div>
                    {/* <div className="form-group">
                        <label htmlFor="link">Link:</label>
                        <input
                            type="text"
                            id="link"
                            name="link"
                            value={announcement.link}
                            onChange={(e) => setannouncement({ ...announcement, link: e.target.value })}
                            className="form-input"
                        />
                    </div> */}
                    <button type="submit" className="submit-button" disabled={loading}>
                        {announcementId && 'Update Announcement'}
                    </button>
                </form>

                {message && <p>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <Outlet />
        </>
    );
};

export default EditAnnouncement;