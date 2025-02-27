import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CourseAliasList = () => {
  const [courseAliases, setCourseAliases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams();

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchCourseAliases = async () => {
      try {
        const response = await axios.get(`https://classroom.googleapis.com/v1/courses/${courseId}/aliases`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setCourseAliases(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAliases();
  }, []);

  const handleDelete = async (aliasId) => {
    try {
      await axios.delete(`https://classroom.googleapis.com/v1/courses/${courseId}/aliases/${aliasId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setCourseAliases(courseAliases.filter(alias => alias.id !== aliasId));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Course Aliases</h1>
      <ul>
        {courseAliases.map((alias) => (
          <li key={alias.id}>{alias.alias} <button onClick={() => handleDelete(alias.id)}>Delete</button></li>
        ))}
      </ul>
    </div>
  );
};

export default CourseAliasList;