import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import PropTypes from 'prop-types';

const Logout = ({ className }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Remove the uid token from localStorage
    localStorage.removeItem('uid');
    // Redirect to login page
    navigate('/login');
  };
  
  return (
    <button 
      onClick={handleLogout} 
      className={`flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors ${className || ''}`}
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  );
};

Logout.propTypes = {
  className: PropTypes.string
};

export default Logout;
