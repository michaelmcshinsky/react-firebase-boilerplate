# React Firebase Boilerplate

Author: [Michael McShinsky](https://github.com/mmcshinsky) - [Linkedin](https://www.linkedin.com/in/michaelmcshinsky) | [Twitter](https://twitter.com/mikemcshinsky) | [Website](http://mcshinsky.net/)

---

A slightly opinionated yet minimal boilerplate for gettings a react firebase project off the ground quickly. Comes with the option to host with firebase as well as managed firestore rules.

Created to make my own life and others easier without having to recreate the wheel everytime a new project is started.

## Features

- React
  - Function Components and Hooks
  - Context and Redux State Management
  - Public and Private Routing
- Styling / CSS
  - Bootstrap using reactstrap. Like I said... slightly opinionated project.
  - Plain 'ole css styling in an assets folder. Bring in your styled components package if ya want.
- Authentication
  - Login
  - Logout
  - Registration
  - Password Recovery / Reset
- Authorization
  - Claims & Roles (Admin, Editor, Employe, etc...)
- Admin Panel
  - CRUD Tables / Modals for managing Firebase documents
  - Redux-Firebase with hooks for app wide access to firebase APIs.
- Firebase
  - Firestore / Managed Rules
  - Hosting
  - Functions

## Installation

1. Clone the repo: `git clone https://github.com/mmcshinsky/react-firebase-boilerplate.git`
2. `cd react-firebase-boilerplate`
3. Update the `.env` file(s) to match your [firebase settings](https://console.firebase.google.com/). (Gotta _"protect"_ those keys...)
4. `npm install`
5. `npm start`
6. Open on [http://localhost:3000/](http://localhost:3000/) to view your app.
7. Modify to your heart's content!

## Firebase

### Firestore

The boilerplate makes use of redux-firebase to give you access to firestore (and the realtime database) to manage all your data needs. With the use of hooks, you have access to your firebase instance throughout the app. As well, basic firestore rules are set for data security in the firestore.rules file at the root of the project.

### Functions

This projects makes use of firebase functions in order to automate and keep some processes off of the client side app. This enables you to keep data like user objects safe for creation and deletion and leave those rules to both firebase functions and your firestore rules.

#### What's Included?

1. onCreate => Store base user information on firestore upon user creation.
2. onDelete => Set user as `active: false` upon user deletion.
3. seed => A generalized function set to allow you to seed your firestore with data of your choice.
   - You will need to set your auth header token from the current user `getIdToken` to hit the endpoint.Documentation can be found [here](https://firebase.google.com/docs/reference/js/firebase.User).
   - Example Endpoint: `https://your-app-id.cloudfunctions.net/seed`

## Production Todos

- [x] Create example views
- [x] Create firebase seed and user functions
- [ ] Create claim & role based authorization
- [ ] Create testing suite
- [ ] Create react-table wrapper with reactstrap
- [ ] Update firestore rules
- [ ] Create firebase storage use case with rules
- [ ] Consolidate view code into more consumable components
- [ ] Solidify readme with more information about project
- [ ] Add social login options / components
- [ ] User password reset on account page
