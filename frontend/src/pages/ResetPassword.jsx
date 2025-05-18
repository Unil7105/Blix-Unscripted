import axios from 'axios';
import { useState } from 'react'
import {  useSearchParams } from 'react-router-dom'
import { Bounce, toast, ToastContainer } from 'react-toastify';
const BASE_URL = import.meta.env.VITE_API_URL;


function ResetPassword() {
       const [searchParams] = useSearchParams();
       const [formData,setFormData] = useState(
              {
                     password: "",
                     confirmPassword: "",
              }
       );

       const token = searchParams.get('token')
       
       const handleOnChange = (e) => {
              const { name, value } = e.target;
              setFormData({
                ...formData,
                [name]: value,
              });
            };


       const resetPassword = async () =>{
              if(formData.password != formData.confirmPassword){
                     toast.error("Passwords do not match", {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            transition: Bounce,
                            });
              }
              else{
                     axios.post(`${BASE_URL}/reset-password`,{
                            token: token,
                            newPassword: formData.password
                     }).then((res)=>{
                            toast.success(res.data.message, {
                                   position: "top-center",
                                   autoClose: 5000,
                                   hideProgressBar: false,
                                   closeOnClick: false,
                                   pauseOnHover: true,
                                   draggable: true,
                                   progress: undefined,
                                   theme: "light",
                                   transition: Bounce,
                                   });
                     }).catch((err)=>{
                            toast.error(err.response.data.message, {
                                   position: "top-center",
                                   autoClose: 5000,
                                   hideProgressBar: false,
                                   closeOnClick: false,
                                   pauseOnHover: true,
                                   draggable: true,
                                   progress: undefined,
                                   theme: "light",
                                   transition: Bounce,
                                   });
                     })
              }


       } 

  return (
    <>
   <section className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
  <div className="flex justify-center items-center min-h-[400px] w-full max-w-md mx-auto">
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-8 pt-6 pb-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-1">
          Reset Password
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-6">
          Enter your new password below
        </p>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              onChange={handleOnChange}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              onChange={handleOnChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          onClick={resetPassword}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Reset Password
        </button>
      </div>
    </div>
  </div>
  <ToastContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    transition={Bounce}
  />
</section>
    </>
  )
}

export default ResetPassword