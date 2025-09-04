Project Management API
A robust backend API for a project management application, allowing users to register, log in, create and manage projects, tasks, and subtasks. The API features user authentication, role-based access control for project members, and file attachment capabilities for tasks.

🚀 Features
User Authentication: Secure registration, login, and logout with JWT-based access and refresh tokens.

Email Verification: A secure email verification flow for new user accounts.

Password Management: Functionality for password reset via email and changing the current password.

Project Management: Create, view, update, and delete projects.

Team Collaboration: Add and manage project members with different roles (e.g., ADMIN, MEMBER).

Task Tracking: Create, view, update, and delete tasks and subtasks within projects.

File Attachments: Add attachments to tasks (e.g., images, documents).

🛠️ Tech Stack
Backend:

Node.js: JavaScript runtime environment

Express.js: Web framework for building APIs

MongoDB: NoSQL database

Mongoose: ODM (Object Data Modeling) library for MongoDB

JSON Web Tokens (JWT): For secure authentication

Bcrypt: For password hashing

⚙️ Installation and Setup
Clone the repository:

git clone [your-repository-url]
cd [your-repository-folder]


Install dependencies:

npm install


Create .env file:
Create a .env file in the root directory and add the following environment variables.

PORT=8000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password


Run the application:

npm start


The server will start on http://localhost:8000.

📝 API Endpoints
Authentication
|

| Endpoint | Method | Description |
| /api/v1/users/register | POST | Register a new user |
| /api/v1/users/login | POST | Log in a user and get tokens |
| /api/v1/users/logout | POST | Log out the current user |
| /api/v1/users/verify-email/:token | GET | Verify a user's email |
| /api/v1/users/forgot-password-request | POST | Request a password reset link |
| /api/v1/users/reset-password/:token | POST | Reset password using the reset token |
| /api/v1/users/change-password | POST | Change the password of a logged-in user |
| /api/v1/users/refresh-token | POST | Get a new access token using a refresh token |

Projects
| Endpoint | Method | Description |
| /api/v1/projects | POST | Create a new project |
| /api/v1/projects | GET | Get all projects for the logged-in user |
| /api/v1/projects/:projectId | GET | Get a specific project by ID |
| /api/v1/projects/:projectId | PUT | Update an existing project |
| /api/v1/projects/:projectId | DELETE | Delete a project |

Project Members
| Endpoint | Method | Description |
| /api/v1/projects/:projectId/members | POST | Add a member to a project |
| /api/v1/projects/:projectId/members | GET | Get all members of a specific project |
| /api/v1/projects/:projectId/members/:userId | PUT | Update a member's role in a project |
| /api/v1/projects/:projectId/members/:userId | DELETE | Delete a member from a project |

Tasks
| Endpoint | Method | Description |
| /api/v1/tasks/:projectId | POST | Create a new task within a project |
| /api/v1/tasks/:projectId | GET | Get all tasks for a project |
| /api/v1/tasks/:taskId | GET | Get a specific task by ID |
| /api/v1/tasks/:taskId | PUT | Update a task |
| /api/v1/tasks/:taskId | DELETE | Delete a task |

✉️ Contact
For questions or support, please open an issue in the GitHub repository.
