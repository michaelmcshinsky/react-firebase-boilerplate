# React Firebase Starter Kit ⚛️ 🔥

Author: [Michael McShinsky](https://www.linkedin.com/in/michaelmcshinsky)

<a href="https://twitter.com/mikemcshinsky"><img src="https://img.shields.io/twitter/follow/mikemcshinsky.svg?style=social&amp;label=Follow+@mikemcshinsky&amp;maxAge=3600" alt="Twitter" height="20"></a>

---

A slightly opinionated yet minimal starter kit or boilerplate for gettings a react firebase project off the ground quickly. Comes with the option to host with firebase as well as managed firestore rules.

Created to make my own life and others easier without having to recreate the wheel everytime a new project is started.

## Features

- React
  * Function Components and Hooks
  * Context and Redux State Management
  * Public and Private Routing
- Styling / CSS
  * Bootstrap using reactstrap. Like I said... slightly opinionated project.
  * Plain 'ole css styling in an assets folder. Bring in your styled components package if ya want.
- Authentication
  * Login
  * Logout
  * Registration
  * Password Recovery / Reset
- Authorization
  * Claims & Roles (Admin, Editor, Employe, etc...)
- Admin Panel
  * CRUD Tables / Modals for managing Firebase documents
  * Redux-Firebase with hooks for app wide access to firebase APIs.
- Firebase
  * Firestore / Managed Rules
  * Hosting
  * Functions

## Instructions

1. Clone the repo: `git clone https://github.com/mmcshinsky/react-firebase-starter.git`
2. `cd react-firebase-starter`
3. Update the `.env` file(s) to match your [firebase settings](https://console.firebase.google.com/). (Gotta *"protect"* those keys...)
4. `npm install`
5. `npm start`
6. Open on [http://localhost:3000/](http://localhost:3000/) to view your app.
7. Modify to your heart's content!

## Production Todos

- [x] Create example views
- [ ] Create claim & role based authorization
- [ ] Create testing suite
- [ ] Create react-table wrapper with reactstrap
- [ ] Update firestore rules
- [ ] Create firebase storage use case with rules
- [ ] Consolidate view code into more consumable components
- [ ] Solidify readme with more information about project
- [ ] Add social login options / components
- [ ] User password reset on account page
