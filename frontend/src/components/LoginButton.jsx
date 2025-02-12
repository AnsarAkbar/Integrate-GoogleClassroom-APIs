import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios"

const LoginButton = () => {
  const { loginWithRedirect, getIdTokenClaims } = useAuth0();

  async function test(e) {
    e.preventDefault();
    await loginWithRedirect();
    const tokenId = await getIdTokenClaims();
    const response = await axios.post("http://localhost:5000/client/auth/google-login", { tokenId });
    console.log('response', response);
    
    // window.location.reload(); // Removed this line to stop reloading the page
  }

  return <button type="submit" onClick={(e) => test(e)}>Log In</button>;
};

export default LoginButton;
