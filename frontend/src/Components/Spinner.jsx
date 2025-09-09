import React from 'react'
function Spinner() {
  return (

    <div className='h-[106vh]  flex items-center justify-center   -mt-10 fixed inset-0 bg-black/65 backdrop-blur-sm z-50'>

    <div className='  flex items-center justify-center   -mt-10 '>

        <div  className=''>
            <img src="https://i.pinimg.com/originals/49/23/29/492329d446c422b0483677d0318ab4fa.gif" alt="" width={650} />

        </div>
    </div>

    </div>
  )
}

export default Spinner
