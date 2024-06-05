# Web Chat App
#### This app is built using Reactjs as frontend with vite bundler and nodejs + express as back end.
#### At the backend it uses clodinary for storing the images of the user.
# App
## Home Screen
![Home Screen](image.png)
## Chat Screen
![Chat Screen](image-1.png)
## Signup/Login Page
![Login Screen](image-2.png)
## Profile Section
![Profile Section](image-3.png)

## Some Function of the application
#### The user is able to chat with other user in realtime. The MongoDB stores the messages sent and received by the user. The User can freely change his/her profile image and name as well as email. Every user is able to delete the messages sent by themselves only in any chat.
#### The user can create groups and chat in that group same like one to one chat it inludes realtime chatting and non-realtime storage of messages. The user create the group is admin of that group and has the authority to delete the group. 

# FrontEnd Env file structure
#### VITE_SERVER_URL = ....
#### during development the link can be the url of the backend server, during the production it needs the link of the server hosted.
# BackEnd Env file structure
#### PORT = ....
#### MongoUri = ....
#### Cloud_name= ....
#### Cloud_ApiKey = ....
#### Cloud_ApiSecret = ....
#### Mongouri is the mongodb connection key. It can either be localhost for mongodb compass connction string and can also be the mongodb atlas connection string.
#### The Cloud name,apikey and secret key can be found after creating an account on cloudinary website and using that for storing the images of the users in the cloudinary databse.
