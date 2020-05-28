# Share Secret Anonymously web app

'Share Secret Anonymously' is a simple web platform, where users register and login either locally or through Google OAuth 2.0, to create an account, and then are able to submit a secret anonymously with the rest of the other registered users. The platform is developed in NodeJS (Express server) utilising the latest industry standard security practices for hashing and salting passwords and other sensitive user data. Passport, Passport-Local and Passport-Local-Mongoose were utilised for managing registration and login process, as well as Passport-Google-OAuth 2.0 package. In addition to HTML5 and CSS, Bootstrap and EJS templating were also used for the front-end. 
The web app also utilises sessions and cookies to persist user sessions throughout the website.


#### Home screen
<img src=images/Home-screen.JPG>

#### Login screen
<img src=images/Login-screen.JPG>

#### Register screen
<img src=images/Register-screen.JPG>

#### Google OAuth screen
<img src=images/OAuth-with-Google-login.JPG>

#### Shared secrets screen
<img src=images/Shared-secrets-screen.JPG>

#### Submit a secret screen
<img src=images/Submit-a-secrets-screen.JPG>



## Installation + Prerequisites

- First you will need to clone the website locally using the command below:

```bash
git clone https://github.com/hazzaldo/Share-secret-anonymously-web-app.git
```
- You need to make sure you have the latest [Node JS](https://nodejs.org/en/) installed. 

- Open the project in any code editor - e.g. Atom, VSCode, Sublime (I personally use VSCode).

- You also need to have [MongoDB](https://www.mongodb.com/) locally installed and configured. This is optional: you can also install a MongoDB client interface such as [Robot T3](https://robomongo.org/) which will simplify interaction with MongoDB databases.

- Finally, in order for Google OAuth 2.0 registration and login to work on the website, you need to create and configure a [Google Client ID and Client Secret](https://developers.google.com/adwords/api/docs/guides/authentication), on the [Google Developer Console](https://console.developers.google.com/). 

- Once created, you need to create a `.env` file in the project root, and paste the client ID and client secret in this file like so:

```
GOOGLE_CLIENT_ID=paste client ID here
GOOGLE_CLIENT_SECRET=paste client secret here
```

- Now, open a terminal window and navigate to the project root directory. Then run the command below, to install all project required dependencies/packages:

```javascript

npm install
```

## Usage
Open two terminal windows - one the command to connect to the MongDB database and the other to launch the website. In both terminal windows make sure you navigate to the project root directory. Otherwise the next steps will NOT work. 

In the first terminal window, run the command below to connect to and run the MongoDB database: 
```
mongod
```
In the second terminal window, run the command below to launch website:
```
nodemon app.js
```
You should see the message below in the terminal, which indicates the website has launched successfully:
```
[nodemon] starting `node app.js`
Server started on port 3000
Server connected successfully to MongoDB
```

Now open a browser window and go to the address `http://localhost:3000/` . You should now see the website and be able to use it.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
