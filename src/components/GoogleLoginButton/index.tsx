// GoogleLoginButton.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { api } from '../../lib/axios';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

import '../LoginButton/styles.scss';

export const clientId = '75067421805-maac5mvgluvp53g7slga5326krteuf5t.apps.googleusercontent.com';

type User = {
  email: string;
  googleId: string;
  name: string;
};

export function GoogleLoginButton() {
  const navigate = useNavigate(); // Access navigate function
  const { setVerifiedUser } = useContext(AuthContext); // Access setUser from Auth context
  const [user, setUser] = useState<User | undefined>();


const handleSuccess = async (res: GoogleLoginResponse | GoogleLoginResponseOffline): Promise<void> => {
  const { profileObj } = res as GoogleLoginResponse;
  const { email, googleId, name } = profileObj;
  if (!email || !name || !googleId) {
    throw new Error("Missing infos from Google");
  }

  setUser({ email, googleId, name });
  
  try {
    const response = await api.post('/login', user);

    if (response.status === 405) {
      console.log("User not allowed:", response.data);
    } else {
      const authToken = response.data.authToken;
      setVerifiedUser({ name, email, authToken }); // Update user in Auth context with token
      navigate('/our-money/transactions'); // Redirect to "/transactions" page
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

  const handleError = (error: object) => {
    console.log('Login Failed', error);
  };

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Login with Google"
      onSuccess={handleSuccess}
      onFailure={handleError}
      cookiePolicy={'single_host_origin'}
      isSignedIn={true}
      prompt="select_account" // Allow user to select another account
    />
  );
}
