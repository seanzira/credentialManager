# Managing-Credentials

Managing-Credentials is a comprehensive application designed to handle credential management efficiently. From user registration to login, this project facilitates the management of credentials based on user roles, including normal users, management, and administrators. 

# Table of contents
- [Project Details](#project-details)
- [Features](#features)
- [Usage](#usage)
- [Installation](#installation)
- [License](#license)
- [Contact](#contact)

## Project Details

This project addresses the need for secure and organized credential management. Users can register, log in, and manage their credentials, with access and functionalities tailored to their roles:
- **Normal User**: Basic access to manage personal credentials.
- **Management**: Enhanced capabilities to oversee user credentials.
- **Admin**: Full control over the application, including user roles and permissions.

## Features

- **User Registration and Login**: Securely register and authenticate users.
- **Role-Based Access Control**: Manage access to features based on user roles.
- **Credential Management**: Add, edit, and delete credentials easily.
- **User Role Management**: Change user roles and permissions as needed.

## Usage
Upon launching the application, users are presented with a menu that allows them to:

1. Register a new account.
2. Log into an existing account.
3. Manage user roles and credentials based on their access level.

## Installation
To set up the application on your local machine, follow these steps:

1. **Download the Project Files**: 
   Clone the repository or download it as a ZIP file. If you’re using Git, run:
   ```bash
   git clone https://github.com/username/managingCredentials.git
2. **Navigate to the Project Directory**
   Tpe: 
   ```bash
   cd managingCredentials
4. **Set up the environment variables**
   Create a .env file in the root of the project's directory to configure your        environment settings. This might include adding:
   ```bash
   PORT:3001
   DATABASE_URL=your_database_url
   JWT_SECRET=FfrRdz72tKrsmgFAj8WXrIJw8e5v1bad
5. **Seed the database**
   To seed the database, you might need to run a seeding script, to which you can 
   run:
   ```bash
   npm run seed
6. **Start the application**
   Launch the app by typing:
   ```bash
   npm start
7. **Access application**
   Open your web browser and navigate to the 'http://localhost:3000' to access the 
   application.
8. Troubleshooting: If you encounter any issues during installation or running the 
   application, check the following:

   Ensure that all dependencies are correctly installed without errors.
   Verify your environment variables are set correctly.
   Check the terminal for any error messages that can guide you to potential 
   solutions.

## License
ManagingCredentials is licensed under the HyperionDev License. See the LICENSE file for more information.

## Contact
For questions, suggestions, or feedback, please reach out to:

Email: seanzira2401@gmail.com
