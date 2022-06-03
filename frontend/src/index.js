import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from "./store";
import { Provider } from "react-redux";
import {SnackbarProvider} from "notistack";
import {HelmetProvider} from "react-helmet-async";
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <SnackbarProvider maxSnack={1}>
          <App />
        </SnackbarProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);


// anchorOrigin = {{vertical:"top", horizontal:"center"}} TransitionComponent={Zoom}
// import { Zoom } from '@mui/material';