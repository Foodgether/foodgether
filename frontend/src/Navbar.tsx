import React, { FC } from 'react';
import { Link } from "react-router-dom";
import Logo from './logo.png'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AuthForm from './Navbar/AuthForm';
const AuthFormSwal = withReactContent(Swal)

const Navbar:FC = () => {
  const showAuthForm = () => {
    AuthFormSwal.fire({
      html: <AuthForm/>,
      didOpen: () => {
        Swal?.getPopup()?.querySelector('input')?.focus()
      },
      showConfirmButton: false
    })
  }
  return <nav className="border-gray-200 px-2 sm:px-4 py-2.5 bg-gradient-to-br from-pink-500 to-orange-400">
    <div className="container flex flex-wrap justify-between items-center mx-auto">
      <Link to="/" className="flex items-center object-contain h-full">
        <img className="object-contain max-w-xs" src={Logo}/>
      </Link>
      <button data-collapse-toggle="mobile-menu" type="button"
              className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"></path>
        </svg>
        <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"></path>
        </svg>
      </button>
      <div className="hidden w-full md:block md:w-auto" id="mobile-menu">
        <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
          <li>
            <button
              onClick={showAuthForm}
              className="rounded-lg border border-2 border-pink-900 hover:border-white text-2xl font-medium block py-2 pr-4 pl-3 text-pink-900 hover:text-white border-gray-700">Register/Login</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
}

export default Navbar;
