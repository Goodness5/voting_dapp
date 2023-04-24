import React from 'react'
import { Link } from 'react-router-dom'
import ConnectionButton from './ConnectionButton'

const Navbar = () => {
  return (
<div className='flex justify-end items-center py-3 border-b border-gray-300'>
  <Link to={'/'} className="px-3 py-2 rounded-lg bg-black text-yellow-50 hover:bg-gray-100 hover:text-gray-900">Home</Link>
  <Link to={'/create-ballot'} className="px-3 bg-black py-2 rounded-lg text-yellow-50 hover:bg-gray-100 hover:text-gray-900 mx-3">Create Ballot</Link>
  <div className=" pl-32">
    <ConnectionButton />
  </div>
</div>


  )
}

export default Navbar