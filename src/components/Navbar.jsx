import React from 'react'
import { Link } from 'react-router-dom'
import ConnectionButton from './ConnectionButton'

const Navbar = () => {
  return (
    <div className='flex justify-center items-center py-3 border-b border-gray-300'>
        <Link to={'/'} className="border border-green-400 rounded-lg py-2 px-4">Home</Link>
        <Link to={'/create-ballot'} className="mx-5 border border-green-400 rounded-lg py-2 px-4">Create Ballot</Link>
        <ConnectionButton />
    </div>
  )
}

export default Navbar