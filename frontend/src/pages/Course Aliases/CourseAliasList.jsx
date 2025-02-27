import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useApi from '../../utils/api';

const CourseAliasList = () => {
  const [courseAliases, setCourseAliases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams();
  const { apiRequest }=useApi()


  useEffect(() => {
    const fetchCourseAliases = async () => {
      try {
        const response = await apiRequest(`https://classroom.googleapis.com/v1/courses/${courseId}/aliases`);
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
      apiRequest(`https://classroom.googleapis.com/v1/courses/${courseId}/aliases/${aliasId}`, 'DELETE');

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