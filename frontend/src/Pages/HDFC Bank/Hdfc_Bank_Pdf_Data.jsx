import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineShortText } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { RiNumbersFill } from "react-icons/ri";
import { setPdfData } from '../../Redux State/Slices/UserSlice';
import { exportToExcelHdfc } from './Export_To_Excel_Hdfc';
import { exportToCSVHdfc } from './Export_To_Csv_Hdfc';


function Hdfc_Bank_Pdf_Data() {

  const navigate = useNavigate()

  const pdfData = useSelector((state)=>state.user.pdfData)
  const dispatch = useDispatch()


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

    const formattedData = pdfData?.map(txn => ({
        Date: txn.date,
        Narration: txn.narration,
        "Chq./Ref.No.": txn.refNo,
        "Value Dt": txn.valueDate,
        "Withdrawal Amt.": txn.withdrawal,
        "Deposit Amt.": txn.deposit,
        "Closing Balance": txn.balance,
        Remark: txn.remark,
    }));

    const exportToExcel = ()=>{
        exportToExcelHdfc(formattedData)
    }
    const exportToCSV = ()=>{
        exportToCSVHdfc(pdfData)
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
          <p onClick={()=>setIsEdit(true)} className='lg:text-[1.2vw] text-[4vw] cursor-pointer px-4 py-2 rounded-lg bg-green-400 text-white font-semibold'>Edit</p>
        }
      </div>
      
      <div className='overflow-x-auto '>
        <div className='  w-[95vw] lg:w-full'>

          {/* HEading  */}
          <div className='flex justify-between gap-6 lg:gap-0 font-semibold mt-6  rounded-lg py-2 text-gray-500 px-4 '>
            <p className=' lg:w-[7vw] w-[7rem] flex-shrink-0  flex gap-2 items-center'><span className='text-blue-400'><FaRegCalendarAlt/></span>Date</p>
            <p  className=' lg:w-[15vw]  w-[18rem]  flex-shrink-0    flex gap-2 items-center'><span className='text-blue-400'><MdOutlineShortText/></span>Narration</p>

            <p  className=' lg:w-[10vw]  w-[9rem]  flex-shrink-0    flex gap-2 items-center '><span className='text-blue-400'><MdOutlineShortText/></span>Chq./Ref.No.</p>

            <p className=' lg:w-[7vw] w-[7rem] flex-shrink-0  flex gap-2 items-center'><span className='text-blue-400'><FaRegCalendarAlt/></span>Value Dt</p>

            <p className=' lg:w-[8vw]  w-[7rem]  flex-shrink-0   flex gap-2 items-center'><span className='text-blue-400'>₹</span>Withdrawal Amt.</p>

            <p className='lg:w-[8vw]   w-[12rem]  flex-shrink-0   flex gap-2 items-center'><span className='text-blue-400'><BiCategory/></span>Deposit Amt.</p>

            <p className='lg:w-[8vw]   w-[12rem]  flex-shrink-0   flex gap-2 items-center'><span className='text-blue-400'><BiCategory/></span>Closing Balance</p>

            <p className='lg:w-[10vw]   w-[12rem]  flex-shrink-0   flex gap-2 items-center'><span className='text-blue-400'><BiCategory/></span>Remark</p>
          </div>

          <div className='flex flex-col gap-1 mt-4   rounded-lg '>



            {pdfData?.map((data,index) => {
              return (
                <div key={data.narration} className={`flex px-4 gap-6 lg:gap-0 justify-between items-center ${index%2===0 ? "bg-[#fafafa]":"bg-white"} border-[#c0c0c0] py-3`}>
                  <p className='lg:w-[7vw]  flex-shrink-0   w-[7rem]  '>{data?.date}</p>

                  <p className=' lg:w-[15vw]  w-[18rem]  flex-shrink-0    overflow-scroll whitespace-nowrap hide-scrollbar  '>
                    {data?.narration}
                  </p>

                  <p className=' lg:w-[10vw]  w-[9rem]  flex-shrink-0    overflow-scroll whitespace-nowrap hide-scrollbar  '>
                    {data?.refNo}
                  </p>

                  <p className='lg:w-[7vw]  flex-shrink-0   w-[7rem]  '>{data?.valueDate}</p>
                
                  <div className=' lg:w-[8vw]  w-[7rem]  flex-shrink-0   '>
                    {   
                        data?.withdrawal && 
                        <div>
                            <span className='font-semibold text-green-400'>₹</span> {data?.withdrawal}
                        </div>
                    }
                  </div>
                
                  <div className=' lg:w-[8vw]  w-[7rem]  flex-shrink-0   '>
                    {   
                        data?.deposit && 
                        <div>
                            <span className='font-semibold text-green-400'>₹</span> {data?.deposit}
                        </div>
                    }
                  </div>


                  <p className=' lg:w-[8vw]  w-[7rem]  flex-shrink-0   '><span className='font-semibold text-green-400'>₹</span> {data?.balance}</p>

                  {/* Remark  */}
                  {
                    isEdit ? (
                        <input type="text"
                         onChange={(e)=>handleRemarkChange(e,data?.narration)}
                         className='border rounded-full border-[#b5b5b5] lg:w-[10vw] w-[12rem] flex-shrink-0   py-1 px-2  outline-none cursor-pointer'
                         value={data.remark}
                         />
                    ):
                    <p className=' lg:w-[10vw]   w-[12rem]  flex-shrink-0   '> {data?.remark}</p>

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



export default Hdfc_Bank_Pdf_Data
