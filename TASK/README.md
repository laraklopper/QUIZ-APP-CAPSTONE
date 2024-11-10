# FINAL CAPSTONE

The proposed web application (‘software product’) is a quiz application. The intended users who will benefit are individuals who will benefit from the application are individuals that enjoy quiz games for recreational purposes
The application is written (created) using MERN stack which is a popular open source `JavaScript-based` developer friendly web stack. MERN stack uses `MongoDB` to handle the database, `React.js` to create the front-end, `Express.js` to create the back end and uses `Node.js` as the runtime environment.
React.js allows you to write code use it an unlimited number of times therefore allowing you to write more modular code therefore making it easier to read and less complicated making it highly efficient for building dynamic and interactive web pages. Further, `(CRA)` can be generated in the `command line interface` using only one command which therefore saves time.
Therefore, `MongoDB` will handle the database, `Express.js` will provide the web application framework to develop the server-side, `React.js`, (create-react-app) will be used to create the front-end, user-interface and `Node.js` will be used as the `JavaScript` runtime environment. 

**GLOSSARY**
- **JSON (JavaScript Object Notation):**
-	**Middleware:** In MERN stack, middleware refers to the different types of software components that facilitates communication between the application.
-	**Proxy Server:** a proxy server is an intermediatory between the front-end(client) and the back-end(server) that works by intercepting web access between a sender and the receiver.
-	**Express middleware:** Middleware in express Express.js is essentially on its own a routing and middleware web framework that has minimal functionality on its own and is therefore essentially a series of middleware function calls.
-	**REST APIS (REPRESENTATIONAL STATE TRANSER):** A REST API is request sent from the front-end to backend. 
-	**Web stack:** a web stack refers to the combination of tools and technologies used create a website or web application.

## TABLE OF CONTENTS
1. [HOW TO USE THE APPLICATION](#how-to-use-the-application)
2. [HOW TO RUN THE APPLICATION](#how-to-run-the-application)
3. [DEPLOYMENT](#deployment)
4. [REFERENCES](#references)

## HOW TO USE THE APPLICATION

## HOW TO RUN THE APPLICATION
A proxy server is included in the front-end to allow the front and back-end to run together. The application uses ‘nodemon’ third-party middleware in the back-end to allow the application to run the back-end and front-end in the command line interface(CLI) or terminal using `npm start`.
The application is connected to the MongoDB database using mongoose third-party middleware in the `app.js` file in the back-end (server) folder. The code uses `mongoose.connect()` to establish a connection between the application and the MongoDB database.
The MongoDB connection URI is constructed using the username, password, cluster URL and the database name. These are stored as environmental variables in the .env file. The `.env` file is configured using `dotenv` middleware.

### **How to modify MongoDB URI's and API Keys**

### **Application security**

To ensure security the application uses several third-party middleware libraries, custom-middleware in the back-end and general user authentication and authorisation in the front and backend code.

## DEPLOYMENT
### Platforms
There are several platforms that can be used to deploy  a web application, for example, Heroku, Vercel, Render and Netlify, inter alia.
However, although Heroku is a ‘platform as a service (PaaS)’ that simplifies management and supports multiple programming languages and frameworks, deploying an application on Heroku requires additional costs, `Vercel` is a platform used to host static sites and serverless functions and is largely optimised for `Next.js` applications and offers features like automatic `SSL (Secure Sockets Layer)` , edge caching and serverless deployment.

### How has the application been deployed

### Link to the deployed application
## REFERENCES
- https://www.nobledesktop.com/classes-near-me/blog/
- https://www.geeksforgeeks.org/nextjs-vs-reactjs-which-one-to-choose/#is-next-better-than-react
- https://www.geeksforgeeks.org/folder-structure-for-a-node-js-project/
- https://www.geeksforgeeks.org/what-is-package-json-in-node-js/?ref=ml_lbp
- https://www.geeksforgeeks.org/what-are-functional-requirements-in-system-design-examples-definition/
- https://www.geeksforgeeks.org/what-are-non-functional-requirements-in-system-design-examples-definition/?ref=next_article
- https://www.geeksforgeeks.org/software-engineering-classification-of-software-requirements/
- https://vercel.com/docs/cli/domains#usage
- https://docs.netlify.com/
- https://devcenter.heroku.com/categories/reference 
