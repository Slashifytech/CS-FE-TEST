import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';

const VerificationLoader = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkInterval = setInterval(() => {
      const route = localStorage.getItem("enString");
      if (route && route.trim() !== "") {
        clearInterval(checkInterval);
        clearTimeout(timeout);
        navigate(`/user-dashboard/${route}`);
      }
    }, 200);

    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      navigate('/');
    }, 5000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className='mt-72'><Loading customText={"Please wait "}/></div>
  );
};

export default VerificationLoader;
