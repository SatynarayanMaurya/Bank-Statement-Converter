import LeftSidebar from './Components/LeftSidebar'
import { Routes,Route, useLocation } from 'react-router-dom'
import LoginPage from "./Pages/Authentication/LoginPage"
import Signup from "./Pages/Authentication/Signup"
import FileUpload from './Pages/File Uploads/FileUpload'
import Navigation from './Components/Navigation'
import { useSelector } from 'react-redux'
import Axis_Bank_Pdf_Data from './Pages/Axis Bank/Axis_Bank_Pdf_Data'
import Kotak_Bank_Pdf_Data from './Pages/Kotak Bank/Kotak_Bank_Pdf_Data'
import ICICI_Bank_Pdf_Data from './Pages/ICICI Bank/ICICI_Bank_Pdf_Data'
import Central_Bank_Pdf_Data from './Pages/Central Bank/Central_Bank_Pdf_Data'
import ICICI_Bank_Pdf_data_Business from './Pages/ICICI Bank/ICICI_Bank_Pdf_data_Business'
import Hdfc_Bank_Pdf_Data from './Pages/HDFC Bank/Hdfc_Bank_Pdf_Data'
import Data_Export_By_Python from './Pages/HDFC Bank/Data_Export_By_Python'
import Dashboard from './Components/Dashboard'


function App() {

  const location = useLocation();
  const bankName = useSelector((state)=>state.user.bankName)

  return (
    <div className='w-full min-h-screen '>
      <Navigation/>
      <div className="flex ">

        {/* Sidebar */}
        <div>
          {
            (location?.pathname !== "/auth" && location?.pathname !== "/signup") && <LeftSidebar />
          }
          
        </div>

        {/* Main Content Area */}
        <div className="flex-1 ">
          <Routes>
            
            <Route path="/" element={<FileUpload />} />

            <Route path="/auth" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pdf-data" 
              element={
                bankName === "axisBank" ? <Axis_Bank_Pdf_Data/>:
                bankName === "kotakBank" ? <Kotak_Bank_Pdf_Data/>:
                bankName === "centralBank" ? <Central_Bank_Pdf_Data/>:
                bankName === "iciciBankSavings" ? <ICICI_Bank_Pdf_Data/>:
                bankName === "iciciBankBusiness" ? <ICICI_Bank_Pdf_data_Business/>:
                // bankName === "hdfcBank" ? <Hdfc_Bank_Pdf_Data/>:
                bankName === "hdfcBank" ? <Data_Export_By_Python/>:
                <Axis_Bank_Pdf_Data/>
              } 
            />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}


export default App
