import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"
import supabase from "../../Database/Supabase"
import { BsFilePdf } from "react-icons/bs";
import { setLoading, setPdfData ,setBankNames} from "../../Redux State/Slices/UserSlice";
import Spinner from "../../Components/Spinner";
const BASE_URL = "https://bank-statement-converter-2nlj.onrender.com/"




const MAX_UPLOADS_PER_DAY = 10;

const FileUpload = () => {


  const dispatch = useDispatch()
  const loading = useSelector((state)=>state.user.loading)
  const navigate = useNavigate()
  const userDetails = useSelector((state)=>state.user.userDetails)
  const pdfData  = useSelector((state)=>state.user.pdfData)


  const [files, setFiles] = useState([]);
  const [bankName,setBankName] = useState(useSelector((state)=>state.user.bankName) || "")

  const changeBankName = (e)=>{
    setBankName(e.target.value);
    dispatch(setBankNames(e.target.value))
  }

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


  const checkAndIncrementUploadCount = () => {
    if (!userDetails?.id) {
      toast.error("User not identified");
      return false;
    }

    const userId = userDetails.id;
    const today = new Date().toLocaleDateString(); // e.g., "6/20/2025"
    const storageKey = `pdf_uploads_${userId}`;

    // Get stored data (count + last upload date)
    const storedData = JSON.parse(
      localStorage.getItem(storageKey) || '{"count":0,"date":""}'
    );

    // Reset count if the date changed (new day)
    if (storedData.date !== today) {
      storedData.count = 0;
      storedData.date = today;
    }

    // Reject if limit reached
    if (storedData.count >= MAX_UPLOADS_PER_DAY) {
      toast.error(`Maximum ${MAX_UPLOADS_PER_DAY} PDFs per day.`);
      return false;
    }

    // Increment count and update storage
    storedData.count++;
    localStorage.setItem(storageKey, JSON.stringify(storedData));
    return true;
  };

  const insertIntoSupabase = async () => {
      if (!userDetails) {
          toast.error("Please Login first");
          return;
      }


      const userId = userDetails.id;

      if (!files || !files[0]) {
          toast.error("No PDF file selected");
          return;
      }

      try {
          dispatch(setLoading(true));

          const file = files[0];
          const sanitizedFileName = file.name.replace(/\s+/g, '_'); // Replace spaces with underscores
          const filePath = `user_${userId}/${Date.now()}_${sanitizedFileName}`;

          // Upload with explicit content type and better error handling
          const { data: uploadData, error: uploadError } = await supabase.storage
              .from("pdfs")
              .upload(filePath, file, {
                  cacheControl: "3600",
                  upsert: true,
                  contentType: 'application/pdf'
              });

          if (uploadError) {
              throw new Error("PDF upload failed: " + uploadError.message);
          }

          // Store both path and original filename
          const newPdfEntry = {
              path: uploadData.path,
              name: file.name, // Store original filename
              uploadedAt: new Date().toISOString()
          };

          // 2. Fetch existing record
          const { data: existingData, error: fetchError } = await supabase
              .from("monthly_transaction_data")
              .select("*")
              .eq("user_id", userId)
              .limit(1);

          if (fetchError) {
              throw new Error("Error fetching existing data: " + fetchError.message);
          }

          if (existingData && existingData.length > 0) {
              const existing = existingData[0];
              
              const existingPdfArray = Array.isArray(existing.pdfData) ? 
                  existing.pdfData : [];
              
              const updatedPdfData = [...existingPdfArray, newPdfEntry];

              // Update only the pdfData field
              const { error: updateError } = await supabase
                  .from("monthly_transaction_data")
                  .update({ 
                      pdfData: updatedPdfData,
                  })
                  .eq("id", existing.id);

              if (updateError) {
                  throw new Error("Error updating pdfData: " + updateError.message);
              }

          } else {
              // Insert new record with structured pdfData
              const { error: insertError } = await supabase
                  .from("monthly_transaction_data")
                  .insert([{
                      key: `user_dashboard_${Date.now()}`,
                      user_id: userId,
                      pdfData: [newPdfEntry], // Store as array of objects
                  }]);

              if (insertError) {
                  throw new Error("Error inserting new record: " + insertError.message);
              }

          }

          dispatch(setLoading(false));
      } catch (err) {
          console.error("Upload error:", err);
          toast.error("Upload failed: " + err.message);
          dispatch(setLoading(false));
      }
  };

  const handleSubmit = async() => {

    try{
        if (files.length === 0) {
        toast.error("Please upload at least one file.");
        return;
        }
        if(bankName === ""){
            toast.error("Please Select a Bank")
            return;
        }
        if(bankName !== "kotakBank"){
            toast.warn("Currently, only Kotak Bank statements are supported.")
            return;
        }

        if(files?.[0]?.name?.split(".")?.pop() !== "pdf"){
          toast.error("Only PDF File is supported !")
          return;
        }
        const fileSizeMB = (files?.[0]?.size / (1024 * 1024)).toFixed(2);

        if(fileSizeMB > 5){
          toast.error("File is too Large !")
          return;
        }
        const formData = new FormData();
        formData.append('pdfInput', files?.[0]);
        formData.append('password', "210634802");

        if(bankName === "kotakBank"){
            dispatch(setLoading(true))
            const response = await fetch(`${BASE_URL}parse-pdf-kotak-bank`, {
                method: 'POST',
                body: formData,
            });
            dispatch(setLoading(false))
    
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to parse PDF');
            }
            const data = await response.json();
            console.log("Data is : ",data)
            const parsedTransactions = data?.data || [];
    
            dispatch(
                setPdfData(
                    parsedTransactions
                    ?.map((val) => ({ ...val, remark: "No Remark" })) // Add remark field
                    ?.filter((val) => val?.refNo && val?.type !== "credit") // Then filter
                )
            );

            // if(!checkAndIncrementUploadCount()){
            //   return;
            // }
            
            insertIntoSupabase()
            if(parsedTransactions?.length >500){
              toast.error("Please Upload only upto 500 transactions ")
              dispatch(setLoading(false))
              return ;
            }
            navigate("/pdf-data")
        }

        else if(bankName === "axisBank"){
            dispatch(setLoading(true))
            const response = await fetch(`${BASE_URL}parse-pdf-axis-bank`, {
                method: 'POST',
                body: formData,
            });
            dispatch(setLoading(false))
    
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to parse PDF');
            }
    
            const data = await response.json();
            console.log("Data is : ",data)
            const parsedTransactions = data?.data || [];
    
            dispatch(
                setPdfData(
                    parsedTransactions
                    ?.map((val) => ({ ...val, remark: "No Remark" })) // Add remark field
                )
            );
            // if(!checkAndIncrementUploadCount()){
            //   return;
            // }
            
            // insertIntoSupabase()
            if(parsedTransactions?.length >500){
              toast.error("Please Upload only upto 500 transactions ")
              dispatch(setLoading(false))
              return ;
            }
            navigate("/pdf-data")
        }

        else if(bankName === "iciciBankSavings"){
            dispatch(setLoading(true))
            const response = await fetch(`${BASE_URL}parse-pdf-icici-bank`, {
                method: 'POST',
                body: formData,
            });
            dispatch(setLoading(false))
    
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to parse PDF');
            }
    
            const data = await response.json();
            console.log("Data is : ",data)
            const parsedTransactions = data?.data || [];
    
            dispatch(
                setPdfData(
                    parsedTransactions
                    ?.map((val) => ({ ...val, remark: "No Remark" })) // Add remark field
                )
            );
            // if(!checkAndIncrementUploadCount()){
            //   return;
            // }
            
            // insertIntoSupabase()
            if(parsedTransactions?.length >500){
              toast.error("Please Upload only upto 500 transactions ")
              dispatch(setLoading(false))
              return ;
            }
            navigate("/pdf-data")
        }
        
        else if(bankName === "iciciBankBusiness"){
            dispatch(setLoading(true))
            const response = await fetch(`${BASE_URL}parse-pdf-icici-bank-business`, {
                method: 'POST',
                body: formData,
            });
            dispatch(setLoading(false))
    
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to parse PDF');
            }
    
            const data = await response.json();
            console.log("Data is : ",data)
            const parsedTransactions = data?.data || [];
    
            dispatch(
                setPdfData(
                    parsedTransactions
                    ?.map((val) => ({ ...val, remark: "No Remark" })) // Add remark field
                )
            );
            // if(!checkAndIncrementUploadCount()){
            //   return;
            // }
            
            // insertIntoSupabase()
            if(parsedTransactions?.length >500){
              toast.error("Please Upload only upto 500 transactions ")
              dispatch(setLoading(false))
              return ;
            }
            navigate("/pdf-data")
        }
        
        else if(bankName === "hdfcBank"){
            dispatch(setLoading(true))

            const response = await fetch(`${BASE_URL}extract-transactions`, {
              method: 'POST',
              body: formData,
            });

            dispatch(setLoading(false))
    
            const data = await response.json();
            console.log("Data is : ",data)
            const parsedTransactions = data?.transactions || [];
    
            dispatch(
                setPdfData(
                    parsedTransactions
                    ?.map((val) => ({ ...val, Remark: "No Remark" })) // Add remark field
                )
            );
            if(parsedTransactions?.length >500){
              toast.error("Please Upload only upto 500 transactions ")
              dispatch(setLoading(false))
              return ;
            }
            console.log("Pdf Data is : ",pdfData)
            navigate("/pdf-data")
        }

        else if(bankName === "centralBank"){
            dispatch(setLoading(true))
            const response = await fetch(`${BASE_URL}parse-pdf-central-bank`, {
                method: 'POST',
                body: formData,
            });
            dispatch(setLoading(false))
    
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to parse PDF');
            }
    
            const data = await response.json();
            console.log("Data is : ",data)
            const parsedTransactions = data?.data || [];
    
            dispatch(
                setPdfData(
                    parsedTransactions
                    ?.map((val) => ({ ...val, remark: "No Remark" })) // Add remark field
                )
            );
            // if(!checkAndIncrementUploadCount()){
            //   return;
            // }
            
            // insertIntoSupabase()
            if(parsedTransactions?.length >500){
              toast.error("Please Upload only upto 500 transactions ")
              dispatch(setLoading(false))
              return ;
            }
            navigate("/pdf-data")
        }

        else{
            if(!checkAndIncrementUploadCount()){
              return;
            }
          insertIntoSupabase();
          toast.error("Currently We don't Support this bank !")
          return ;
        }
    }
    catch(error){
      dispatch(setLoading(false))
      if (error.message === "No password given") {
        toast.error("Protected PDFs are not allowed")
      }
      else{
        toast.error("Unexpected error "+error)
      }

        console.log("Error while submitting the file is : ",error)
        return;
    }

  };

const handleSubmit2 = async () => {
  try {
    if (!files || files.length === 0) {
      console.log("No file uploaded");
      return;
    }

    const file = files[0];

    if (!file.name.endsWith(".pdf")) {
      console.log("Only PDF files are supported.");
      return;
    }

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    if (fileSizeMB > 5) {
      console.log("File is too large.");
      return;
    }

    const formData = new FormData();
    formData.append("pdfInput", file);
    formData.append("password", "210634802");

    console.log("Sending request...");
    dispatch(setLoading(true))
    const response = await fetch(`${BASE_URL}parse-pdf-nanonet`, {
      method: "POST",
      body: formData,
    });

    console.log("🔍 Full raw result from Nanonets:", JSON.stringify(response, null, 2));

    
    dispatch(setLoading(false))
    console.log("Response received");

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      return;
    }

    const data = await response.json();
    console.log("✅ Parsed Response Data:", data);

  } catch (error) {
    console.error("❌ Error in catch block:", error.message || error);
  }
};




  return (
    <div className="md:h-[91vh] mt-[10vh] md:mt-0 bg-[#f6f6f6] flex flex-col items-center justify-center px-4 ">
        {loading && <Spinner/>}
      <div className="bg-white rounded-xl shadow-md w-full max-w-4xl p-6">
        <div className=" mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-700">
          Upload Bank Statement
          </h2>
          <p className="text-sm text-center text-blue-700">We don't store any data</p>
        </div>

        <div className="flex flex-col  md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className="flex-1 border-2 border-dashed border-blue-500 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 transition"
          >
            <input {...getInputProps()} />
            <div className="text-blue-500 mb-2 text-4xl">
              <BsFilePdf/>
            </div>
            <p className="text-gray-700 font-medium">Drag and Drop your file</p>
            <p className="text-gray-500 mb-3">or</p>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Upload
            </button>
          </div>

          {/* Uploaded files preview */}
          <div className="flex-1 border border-gray-300 rounded-lg p-6 bg-gray-50 flex justify-center items-center">
            {files.length === 0 ? (
              <p className="text-gray-500 text-center ">No Files Uploaded Yet</p>
            ) : (
              <ul className="text-left space-y-2 text-gray-700">
                {files.map((file) => (
                  <li key={file.name} className="truncate">{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Submit button */}
        <div className="mt-6 text-center flex justify-center gap-4 items-center">

          <select name="bankName" id="" value={bankName} onChange={(e)=>changeBankName(e)} className="border  outline-none appearance-none px-4 py-2 rounded-lg bg-green-400 text-white border-green-500 cursor-pointer">
            <option value="" className="bg-white text-black">Select Bank</option>
            <option value="kotakBank" className="bg-white text-black">Kotak Bank</option>
            <option value="iciciBankSavings" className="bg-white text-black">ICICI Bank - Savings</option>
            <option value="iciciBankBusiness" className="bg-white text-black">ICICI Bank - Business</option>
            <option value="axisBank" className="bg-white text-black">Axis Bank</option>
            <option value="hdfcBank" className="bg-white text-black">HDFC Bank</option>
            <option value="centralBank" className="bg-white text-black">Central Bank</option>
          </select>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 cursor-pointer text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Analyse
          </button>
        </div>
      </div>
    </div>
  );
};





export default FileUpload
