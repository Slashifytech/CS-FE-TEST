import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dnf, nochat } from '../assets';
import { IoArrowBackOutline } from 'react-icons/io5';

const DataNotFound = ({ message, linkText, linkDestination, className }) =>
{
  return (
    <span className={className}>
      <img src={dnf} alt="img" className='w-64' />
      <p className='font-DMsans mt-6  text-center'>{message}</p>
      <Link to={linkDestination} className='mt-3 bg-primary rounded-lg text-white py-2 px-3'>
        {linkText}
      </Link>
    </span>
  );
};

function BackArrow({ className , LinkData})
{
  const navigate = useNavigate();

  const goBack = () => {
    
      navigate(-1); 
    
   
  };
  return (
    <span className={className}>
      <span onClick={goBack}>
      <span className='flex items-center bg-primary md:bg-transparent sm:bg-transparent  text-white py-6 px-6'>
        <IoArrowBackOutline className="md:text-primary sm:text-primary text-[28px] cursor-pointer" />
        <span> Back</span>
        </span>
      </span>
    </span>
  )
}


const ChatDataNotFound = ({ message, linkText, linkDestination, className, custimg }) =>
  {
    return (
      <span className={className}>

        <img src={custimg} alt="img" className='md:w-72 w-52' />
        <p className='font-DMsans   text-center mt-4  mx-6 '>{message}</p>
        <div className='mt-3 my-3 flex justify-center'>
        <Link to={linkDestination} className=' bg-primary rounded-lg  text-white py-2 px-3 md:hidden'>
          {linkText}
        </Link>
        </div>
      </span>
    );
  };

  const ChatNotFound = ({ message, linkText, linkDestination, className, custimg }) =>
    {
      return (
        <span className={className}>
  
          <img src={custimg} alt="img" className='w-72  ' />
          <p className='font-DMsans   text-center mt-4  mx-6 '>{message}</p>
          <div className='mt-3 my-3 flex justify-center'>
          <Link to={linkDestination} className=' bg-primary rounded-lg  text-white py-2 px-3 '>
            {linkText}
          </Link>
          </div>
        </span>
      );
    };
export { DataNotFound, BackArrow, ChatDataNotFound, ChatNotFound };
export default DataNotFound;