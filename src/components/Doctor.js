import React from 'react'
import { useNavigate } from 'react-router-dom'

function Doctor({doctor}) {
    const navigate=useNavigate();
  return (
    <div className='card p-3 cursor-pointer'onClick={()=>navigate(`/book-appointment/${doctor._id}`)}>
      <h1 className='card-title'>{doctor.firstName} {doctor.lastName}</h1>
      <hr/>
      <p><b>Phone Number:</b>{doctor.phoneNo}</p>
      <p><b>Address:</b>{doctor.address}</p>
      <p><b>Fee for consult:</b>{doctor.feeForconsult}</p>
      <p><b>Experience:</b>{doctor.experience}</p>
      <p><b>Visiting Time:</b>{doctor.timings[0]}-{doctor.timings[1]}</p>
      <p><b>Specialization:</b>{doctor.specialization}</p>
    </div>
  )
}

export default Doctor
