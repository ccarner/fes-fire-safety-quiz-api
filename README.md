# FES CMS/API

A Content Management System / Content API to be used by FES staff for creation/hosting of content for the 'FES Fire Safety App'.

Configure file locations on the server from "src/utils/config.js".

Documentation related to the development of this application is included in the team confluence page (requires unimelb vpn) : https://confluence.cis.unimelb.edu.au:8443/display/SWEN900142019FSQuoll/

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). The API is served with an Express server at "./index.js".

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run deploy`

This will build the project, followed by synchronising it with the current deployment; an s3 bucket on AWS. Configure this script to deploy to a new server (see conflunece deployment notes for more information)

## Creat React App Documentation

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
