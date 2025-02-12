import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      // domain="dev-oj4n3yhh5g0ugxw4.us.auth0.com"
      // clientId="MFF48qtwG563jBXWk7XtHN3x0qbZOsbM"
      // authorizationParams={{
      //   redirect_uri: window.location.origin
      // }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
