# BlogMix
A dynamic blog platform built using HTML, CSS, JavaScript, Node.js, Express.js, and EJS, allowing users to securely sign up or log in to create, view, search, and manage blog posts in a user-friendly environment.


## Features
🔐 User Authentication: Secure login and registration functionality using session-based authentication.

✍️ Blog Creation: Authenticated users can write and publish blog posts, which are automatically organized by author.

🧾 Local JSON Storage: All blog posts and user details are stored in a local JSON file, simulating a lightweight database.

🗑️ Ownership-Based Controls: Only the original author of a blog post can delete it, maintaining content integrity and security.

🔍 Search Functionality: Users can search blog posts by keywords.

🌐 Community Browsing: All users can view public blog posts created by others making it community-driven platform.

🎨 Responsive Design – Styled for both desktop and mobile views


## Tech Stack
Frontend: HTML, CSS, JavaScript, EJS (Embedded JavaScript templating)

Backend: Node.js, Express.js

Storage: JSON file-based storage for users and posts


## How to run locally
1. Clone the repository:
       git clone https://github.com/amrutavarma2/BlogMix/  

3. Install dependencies:
npm install

4. Start the server:
node index.js

5. Run the application:
Open your browser and go to:
http://localhost:3000
