<h2>Users CRUD Restful API</h2>
<p>A simple REST API built with Node.js, Express, Mongoose and MongoDB to manage user creation and authentication with JSON web tokens. It supports TypeScript as well.</p>

<h3>How to use it</h3>
<p>Clone the repo to your machine and run <code>npm install</code>. Make sure you have Node.js and MongoDB installed on your machine.
Create a <code>config.json</code> file in the root of the project. Your configuration object should be structured as follows:
<pre>
    {
        "development": {
            "PORT": 3000,
            "MONGODB_URI": "mongodb://127.0.0.1:27017/your_db_name",
            "JWT_SECRET": "your_jwt_secret_key"
        }
    }   
</pre>
Finally, run <code>npm run start-server</code> to run the server with Nodemon.</p>

<h3>Endpoints</h3>
<p>Live example available here: <a href="https://users-crud-api.herokuapp.com/" target="blank">https://users-crud-api.herokuapp.com/</a></p>
<ul>
    <li>
        <h4>Root</h4> 
        <pre>
        GET: /
        example request: <code>https://users-crud-api.herokuapp.com/
        description: returns a 'Hello world' message, no authentication required.
        </pre>
    </li>
    <li>
        <h4>List Users</h4> 
        <pre>
        GET: /users
        example request: https://users-crud-api.herokuapp.com/users
        headers: 
            key: x-auth, 
            value: authentication_token
        description: returns JSON object with all users. Authentication as 'Admin'is required.
         </pre>
    </li>
    <li>
        <h4>Get User</h4> 
        <pre>
        GET: /users/:id
        example request: https://users-crud-api.herokuapp.com/users/5b882d6b1e17a40014239236
        example headers: 
            key: x-auth, 
            value: authentication_token
        description: returns JSON object with user data. Admins can access whatever user data, while users can only access their own data.
        </pre>
    </li>
    <li>
        <h4>Add User (Sign Up)</h4> 
        <pre>
        POST: /users/add
        example request: https://users-crud-api.herokuapp.com/users/add
        headers: 
            key: Content-Type, 
            value: application/json
        example body:
            {
                "userName": "Test User",
                "email": "john.doe@example.com",
                "password": "insecure-password",
                "role": "user"
            }
        description:</b> JSON with all users. Authentication as 'Admin'is required.
        </pre>
    </li>
    <li>
        <h4>Login User (Sign In)</h4> 
        <pre>
        POST: /users/login
        example request: https://users-crud-api.herokuapp.com/users/login
        headers:
            key: Content-Type, value: application/json
            example body:
                {
                    "email": "john.doe@example.com",
                    "password": "insecure-password"
                }
        </pre>
    </li>
    <li>
        <h4>Logout User (Sign Out)</h4> 
        <pre>
        POST: /users/logout/:id
        example request: https://users-crud-api.herokuapp.com/users/logout/5b86fde0ccb8100014444fe2
        headers:
            key: Content-Type, value: application/json
            key: x-auth, value: authentication_token
        </pre>
    </li>
    <li>
        <h4>Delete User</h4> 
        <pre>
        DELETE: /users/delete/:id
        example request: https://users-crud-api.herokuapp.com/users/delete/5b86e62f7f06ee00144a8070
        headers:
            key: x-auth,
            value: authentication_token
        description: return JSON with deletion confirmation. Authentication as 'Admin'is required.
        </pre>
    </li>
    <li>
        <h4>Update User</h4> 
        <pre>
        PATCH: /users/update/5b85a0935c3f960014686a52
        example request: https://users-crud-api.herokuapp.com/users/update/5b85a0935c3f960014686a52
        headers:
            key: Content-Type, value: application/json
            key: x-auth, value: authentication_token
        example body:
            {
                "password": "insecure-password2"
            }
        description: returns JSON with update confirmation. Admins can update whatever user data, while user can only update his/her own data.
        </pre>
    </li>
</ul>

<h3>Deploying to Heroku</h3>
<p>This project is already set up to be deployed to Heroku. In order to do so you should:</p>
<ol>
    <li>Create an application on Heroku following the instructions available here: <a href="https://devcenter.heroku.com/articles/git" target="blank">https://devcenter.heroku.com/articles/git</a></li>
    <li>Install mongolab addon to your Heroku app in order to use MongoDB</li>
    <li>Add a Heroku configuration variable for your JWT_SECRET code <code>config:set JWT_SECRET=your_jwt_secret_key</code></li>
</ol>

<h3>Testing</h3>
<p><code>users</code> route is fully tested using <a href="https://github.com/visionmedia/supertest" target="blank">Jest</a> and <a href="https://github.com/visionmedia/supertest" target="blank">Supertest</a> super-agent driven library. Run <code>npm run test</code> to run the Jest test suite.</p>
