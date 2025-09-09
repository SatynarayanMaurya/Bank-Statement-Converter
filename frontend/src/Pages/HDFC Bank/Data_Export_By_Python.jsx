import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RiNumbersFill } from "react-icons/ri";
import { setPdfData } from '../../Redux State/Slices/UserSlice';

function Data_Export_By_Python() {

    const pdfData = useSelector((state)=>state.user.pdfData)
    const [headers,setHeaders] = useState(Object.keys(pdfData?.[0]));
    // console.log(headers);
    console.log("PDf Data is : ",pdfData?.length)
    useEffect(()=>{
        setHeaders(Object.keys(pdfData[0]))
    },[pdfData])

    
    const [isEdit,setIsEdit] = useState(false)
    
    const handleRemarkChange = (e, refNo) => {
    const newRemark = e.target.value;
    const updatedData = pdfData.map((item) => {
        if (item.narration === refNo) {
            return { ...item, remark: newRemark };
        }
        return item;
    });
    dispatch(setPdfData(updatedData));
    };

  return (
    <div>

      
      <div className='flex justify-between items-center lg:p-4 p-2 border-b border-[#cbcbcb] '>

        <div className='flex flex-col '>
          <div className='flex items-center gap-2'>
            <p className=' text-3xl text-blue-500'><RiNumbersFill/></p>
            <p className='lg:text-[2vw] text-[7vw] font-semibold'>{pdfData?.length}</p>
          </div>
          <p className=''>Total No. of Records</p>
        </div>
        <button className='border px-4 py-2 rounded-lg font-semibold'>Export To excel</button>
        <button  className='border px-4 py-2 rounded-lg font-semibold'>Export To CSV</button>
        {
          isEdit ?
          <p onClick={()=>setIsEdit(!isEdit)}  className='lg:text-[1.2vw] text-[4vw] cursor-pointer px-4 py-2 rounded-lg bg-blue-400 text-white font-semibold'>Save</p>:
          <p onClick={()=>setIsEdit(true)} className='lg:text-[1.2vw] text-[4vw] cursor-pointer px-4 py-2 rounded-lg bg-green-400 text-white font-semibold'>Edit</p>
        }
      </div>

      {/* Headings  */}
      <div className='flex justify-between items-center font-semibold'>
        {
            headers?.map((header,index)=>(
                <p key={index} className=' lg:w-[10vw]  w-[7rem]  flex-shrink-0   flex gap-2 items-center'><span className='text-blue-400'>₹</span>{header}</p>
            ))
        }
      </div>

        {/* Data */}
        {pdfData?.map((dataRow, rowIndex) => (
            <div key={rowIndex} className='flex justify-between items-center border-b py-2'>
                {headers?.map((header, colIndex) => (
                <p
                    key={colIndex}
                    className='lg:w-[10vw] w-[7rem] flex-shrink-0 flex gap-2 items-center overflow-scroll hide-scrollbar whitespace-nowrap'
                >
                    <span className='text-blue-400 '>
                    {header.includes('Amount') || header.includes('Balance') ? '₹' : ''}
                    </span>
                    {dataRow[header] ?? '-'}
                </p>
                ))}
            </div>
        ))}

    </div>
  )
}

export default Data_Export_By_Python
