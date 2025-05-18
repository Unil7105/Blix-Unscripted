import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  // Check if user has a uid token in localStorage
  const uid = localStorage.getItem('uid');
  
  // If there's no uid token, redirect to login page
  if (!uid) {
    return <Navigate to="/login" replace />;
  }
  
  // If uid exists, render the protected component
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;
