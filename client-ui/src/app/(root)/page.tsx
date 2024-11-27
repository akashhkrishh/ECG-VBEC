"use client"
import { Button } from '@/components/ui/button'
import { UploadImage } from '@/components/custom';
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import ResultPage from '@/components/custom/result-page';
import axios from 'axios';
import { useEffect } from 'react';
 


const page = () => {
  const fetchAPI = async() => {
    const response = await axios('http://localhost:5000');
    // console.log(response);

  }

  useEffect(() => {
    fetchAPI()
  },[])

  const { result, predict } = useSelector((state: RootState) => state.data);
  return (
    <div className='h-full w-full fixed'>
       
      {
        (!predict)
        ?<UploadImage/>
        :<ResultPage/>
      }
    </div>
  )
}

export default page