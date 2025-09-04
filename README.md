
# Project Management Platform API

A robust backend API for a project management application, allowing users to register, log in, create and manage projects, tasks, and subtasks. The API features user authentication, role-based access control for project members, and file attachment capabilities for tasks.

Tech Stack - Node.js | Express.js | MongoDB | Mongoose | JWT | Bcrypt 


## Run Locally

Clone the project

```bash
git clone https://github.com/harshborude/Project_management_platform.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`=8000

`MONGODB_URI`=your_mongodb_connection_string

`ACCESS_TOKEN_SECRET`=your_access_token_secret

`REFRESH_TOKEN_SECRET`=your_refresh_token_secret

`EMAIL_HOST`=your_email_host_MAILTRAP

`EMAIL_PORT`=your_email_port_MAILTRAP

`EMAIL_USER`=your_email_user_MAILTRAP

`EMAIL_PASS`=your_email_password_MAILTRAP




## API Endpoints

#### Authentication

```http
 /api/v1/users
```

| Endpoint | Method    | Description                |
| :-------- | :------- | :------------------------- |
| `/register` | `POST` | Register a new user |
| `/login` | `POST` | Log in a user and get tokens |
| `/logout` | `POST` | Log out the current user |
| `/verify-email/:token` | `GET` | Verify a user's email |
| `/forgot-password-request` | `POST` | Request a password reset link |
| `/reset-password/:token` | `POST` | Reset password using the reset token |
| `/change-password` | `POST` | Change the password of a logged-in user |
| `/refresh-token` | `POST` | Get a new access token using a refresh token |

#### Projects

```http
  /api/v1/projects
```

| Endpoint | Method    | Description                |
| :-------- | :------- | :------------------------- |
| `/` | `POST` | Create a new project |
| `/` | `GET` | Get all projects for the logged-in user |
| `/projects/:projectId` | `GET` | Get a specific project by ID |
| `/projects/:projectId` | `PUT` | Update an existing project |
| `/projects/:projectId` | `DELETE` | Delete a project |

#### Project Members

```http
  /api/v1/projects/:projectId/members
```

| Endpoint | Method    | Description                |
| :-------- | :------- | :------------------------- |
| `/` | `POST` | Add a member to a project |
| `/` | `GET` | Get all members of a specific project |
| `/:userId` | `PUT` | Update a member's role in a project |
| `/:userId` | `DELETE` | Delete a member from a project |

#### Tasks

```http
  /api/v1/tasks
```

| Endpoint | Method    | Description                |
| :-------- | :------- | :------------------------- |
| `/:projectId` | `POST` | Create a new task within a project |
| `/:projectId` | `GET` | Get all tasks for a project |
| `/:taskId` | `GET` | Get a specific task by ID |
| `/:taskId` | `PUT` | Update a task|
| `/:taskId` | `DELETE` | Delete a task |
