import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoSaveOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { IoFastFoodOutline } from 'react-icons/io5';
import { FaBusAlt, FaFilm, FaHome, FaHospitalAlt, FaShoppingBag, FaMoneyBill } from 'react-icons/fa';
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineShortText } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { RiNumbersFill } from "react-icons/ri";
import { setPdfData } from '../../Redux State/Slices/UserSlice';
import { exportToExcelCentral } from './Export_To_Excel_Central';
import { exportToCSVCentral } from './Export_To_Csv_Center';


function Central_Bank_Pdf_Data() {

  const navigate = useNavigate()

  const pdfData = useSelector((state)=>state.user.pdfData)
  const dispatch = useDispatch()

  const categories = ["Food","Transportation","Entertainment","Shopping","Utility","HealthCare"]

  const [isEdit,setIsEdit] = useState(false)



const getNarrationParts = (narration, refNo) => {
  const specialPattern = /^NACHDB\d+/;


  if (!narration?.includes('/')) {
    return { base: narration, category: "None" };
  }


  const parts = narration.split('/');
  const category = parts.pop();
  const base = parts.join('/');

  return { base, category };
};

  const handleCategoryChange = (e, refNo) => {
    const newCategory = e.target.value;
    const idx = pdfData.findIndex(item => item.refNo === refNo);
    if (idx === -1) return;

    const { base } = getNarrationParts(pdfData[idx].narration, refNo);
    let newNarration = newCategory === "None" ? base : `${base}/${newCategory}`;

    const updatedData = [...pdfData];
    updatedData[idx] = { ...updatedData[idx], narration: newNarration };
    dispatch(setPdfData(updatedData));
  };

  const handleRemarkChange = (e, refNo) => {
    const newRemark = e.target.value;
    const updatedData = pdfData.map((item) => {
      if (item.description === refNo) {
        return { ...item, remark: newRemark };
      }
      return item;
    });
    dispatch(setPdfData(updatedData));
  };

    const categoryIcons = {
        Food: <IoFastFoodOutline />,
        Transportation: <FaBusAlt />,
        Entertainment: <FaFilm />,
        Housing: <FaHome />,
        HealthAndMedical: <FaHospitalAlt />,
        Shopping: <FaShoppingBag />,
        UtilityBill: <FaMoneyBill />,
    };

    const formattedData = pdfData?.map(txn => ({
        Post_Date: txn.postDate,
        Txn_Date: txn.txnDate,
        Description: txn.description,
        Debit: (txn.type === "debit" ?txn.amount :txn.type==="unknown"&&txn.amount) || null,
        Credit: (txn.type === "credit" &&txn.amount) || null,
        Type: txn.type,
        Remark: txn.remark,
    }));

    const exportToExcel = ()=>{
        exportToExcelCentral(formattedData)
    }
    const exportToCSV = ()=>{
        exportToCSVCentral(pdfData)
    }


  return (
    <div className='lg:px-8 px-2 '>
      
      
      <div className='flex justify-between items-center lg:p-4 p-2 border-b border-[#cbcbcb] '>

        <div className='flex flex-col '>
          <div className='flex items-center gap-2'>
            <p className=' text-3xl text-blue-500'><RiNumbersFill/></p>
            <p className='lg:text-[2vw] text-[7vw] font-semibold'>{pdfData?.length}</p>
          </div>
          <p className=''>Total No. of Records</p>
        </div>
        <button onClick={exportToExcel} className='border px-4 py-2 rounded-lg font-semibold'>Export To excel</button>
        <button onClick={exportToCSV} className='border px-4 py-2 rounded-lg font-semibold'>Export To CSV</button>
        {
          isEdit ?
          <p onClick={()=>setIsEdit(!isEdit)}  className='lg:text-[1.2vw] text-[4vw] cursor-pointer px-4 py-2 rounded-lg bg-blue-400 text-white font-semibold'>Save</p>:
          <p onClick={()=>setIsEdit(!isEdit)} className='lg:text-[1.2vw] text-[4vw] cursor-pointer px-4 py-2 rounded-lg bg-green-400 text-white font-semibold'>Edit</p>
        }
      </div>
      
      <div className='overflow-x-auto '>
        <div className='  w-[95vw] lg:w-full'>

          {/* HEading  */}
          <div className='flex justify-between gap-6 lg:gap-0 font-semibold mt-6  rounded-lg py-2 text-gray-500 px-4 '>
            <p className=' lg:w-[7vw] w-[7rem] flex-shrink-0  flex gap-2 items-center'><span className='text-blue-400'><FaRegCalendarAlt/></span>Post Date</p>
            <p className=' lg:w-[7vw] w-[7rem] flex-shrink-0  flex gap-2 items-center'><span className='text-blue-400'><FaRegCalendarAlt/></span>Txn Date</p>
            <p  className=' lg:w-[20vw]  w-[18rem]  flex-shrink-0    flex gap-2 items-center'><span className='text-blue-400'><MdOutlineShortText/></span>Description</p>
            <p className='lg:w-[6vw]   w-[12rem]  flex-shrink-0   flex gap-2 items-center'><span className='text-blue-400'><BiCategory/></span>Debit</p>
            <p className='lg:w-[6vw]   w-[12rem]  flex-shrink-0   flex gap-2 items-center'><span className='text-blue-400'><BiCategory/></span>Credit</p>
            <p className='lg:w-[12vw]   w-[12rem]  flex-shrink-0   flex gap-2 items-center'><span className='text-blue-400'><BiCategory/></span>Type</p>
            <p className='lg:w-[12vw]   w-[12rem]  flex-shrink-0   flex gap-2 items-center'><span className='text-blue-400'><BiCategory/></span>Remark</p>
          </div>

          <div className='flex flex-col gap-1 mt-4   rounded-lg '>



            {pdfData?.map((data,index) => {

              return (
                <div key={data.narration} className={`flex px-4 gap-6 lg:gap-0 justify-between items-center ${index%2===0 ? "bg-[#fafafa]":"bg-white"} border-[#c0c0c0] py-3`}>
                  <p className='lg:w-[7vw]  flex-shrink-0   w-[7rem]  '>{data?.postDate}</p>
                  <p className='lg:w-[7vw]  flex-shrink-0   w-[7rem]  '>{data?.txnDate}</p>

                  <p className=' lg:w-[20vw]  w-[18rem]  flex-shrink-0    overflow-scroll whitespace-nowrap hide-scrollbar  '>
                    {data?.description}
                  </p>

                    <p className=' lg:w-[6vw]  w-[12rem]  flex-shrink-0   '>
                      {
                        data?.type==="debit" ?
                        <div>
                          <span className='font-semibold text-green-400'>₹</span> {data?.type==="debit"?data.amount:data.amount}
                        </div>:
                        data?.type==="unknown" &&
                        <div>
                          <span className='font-semibold text-green-400'>₹</span> {data.amount}
                        </div>
                      }
                    </p>

                    <p className=' lg:w-[6vw] w-[12rem]  flex-shrink-0   '>
                      {
                        data?.type==="credit" &&
                        <div>
                        <span className='font-semibold text-green-400'>₹</span> {data?.type==="credit" && data.amount}</div>
                      }
                    </p>

                  {/* Category Column */}
                <p className='lg:w-[12vw]  w-[12rem]  flex-shrink-0  flex gap-2 items-center'>{data.type}</p>

                  {/* Remark  */}

                  {
                    isEdit ? (
                        <input type="text"
                         onChange={(e)=>handleRemarkChange(e,data?.description)}
                         className='border rounded-full border-[#b5b5b5] lg:w-[12vw] w-[12rem] flex-shrink-0   py-1 px-2  outline-none cursor-pointer'
                         value={data.remark}
                         />
                    ):
                    <p className=' lg:w-[12vw]   w-[12rem]  flex-shrink-0   '> {data?.remark}</p>

                  }



                </div>
              );
            })}





          </div>
        </div>
      </div>
    </div>
  )
}



export default Central_Bank_Pdf_Data
