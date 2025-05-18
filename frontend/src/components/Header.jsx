import { Link } from 'react-router-dom'

function Header() {
  return (
    <>
    <header className='h-auto w-screen bg-transparent'>
       <nav className='flex justify-evenly'>
              <Link to={"/"}>Home</Link>
              <Link to={"/login"}>Login</Link>
              <Link to={"/signup"}>SignUp</Link>

       </nav>
    </header>
    </>
  )
}

export default Header