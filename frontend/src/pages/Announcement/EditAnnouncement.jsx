import { useEffect, useState } from 'react';
import './CourseAnnouncement.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Outlet } from 'react-router-dom';

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

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        navigate('/login');
    }

    const navigate = useNavigate();
    // console.log('announcement', announcement);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.patch(
                `https://classroom.googleapis.com/v1/courses/${courseId}/announcements/${announcementId}?updateMask=text`,
                {
                    text: announcement?.text,
                    // materials: [
                    //     {
                    //         link: {
                    //             url: announcement?.link,
                    //             title: "Study Guide"
                    //         }
                    //     }
                    // ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            // console.log('response:', response);
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
                const response = await axios.get(
                    `https://classroom.googleapis.com/v1/courses/${courseId}/announcements/${announcementId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setannouncement({ text: response.data.text})
                // setannouncement({ text: response.data.text, link: `${response.data.materials ? response.data.materials[0].link.url : ''}` });
            } catch (error) {
                console.error('Error fetching announcement:', error);
                setError('Error fetching announcement');
            }
        };

        fetchAnnouncement();
    }
        , [courseId, announcementId, accessToken]);


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