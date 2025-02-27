import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './AnnouncementList.css';
import useApi from '../../utils/api';

const AnnouncementList = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [error, setError] = useState(null);
    const { courseId } = useParams();
    const navigate = useNavigate();
    const {apiRequest} =useApi();


    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await apiRequest(`https://classroom.googleapis.com/v1/courses/${courseId}`);
                setCourseName(response.data.name);
            } catch (error) {
                console.error('Error fetching course details:', error);
                setError('Error fetching course details');
            }
        };

        const fetchAnnouncements = async () => {
            try {
                const response = await apiRequest(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`);
                setAnnouncements(response?.data?.announcements || []);
            } catch (error) {
                console.error('Error fetching announcements:', error);
                setError('Error fetching announcements');
            }
        };

        fetchCourseDetails();
        fetchAnnouncements();
    }, []);

    const handleEdit = (announcementId) => {
        navigate(`/edit-announcement/${courseId}/${announcementId}`);
    };

    const handleDelete = async (announcementId) => {
        try {
            const response = await apiRequest(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements/${announcementId}`, 'delete');
            setAnnouncements(announcements.filter(announcement => announcement.id !== announcementId));
        } catch (error) {
            console.error('Error deleting announcement:', error);
            setError('Error deleting announcement');
        }
    };

    return (
        <div className="announcement-list-container">
            <h3>Announcements for {courseName}</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {announcements.length === 0 ? (
                <p>No announcements available.</p>
            ) : (
                <ul className="announcement-list">
                    {announcements.map((announcement) => (
                        <li key={announcement.id} className="announcement-item">
                            <p>{announcement.text}</p>
                            <div>
                                {announcement.materials
                                    && announcement.materials.map((material, index) => (
                                        <a
                                            key={index}
                                            href={material?.link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {material?.link.url}
                                        </a>
                                    ))}
                            </div>
                            <p><small>{new Date(announcement.creationTime).toLocaleString()}</small></p>
                            <div>
                                <button onClick={() => handleEdit(announcement.id)} className="edit-button">Edit</button>
                                <button onClick={() => handleDelete(announcement.id)} className="delete-button">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AnnouncementList;
