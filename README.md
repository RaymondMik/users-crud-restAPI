<h2>Users CRUD Restful API</h2>
<h3>- Document in progress... -</h3>
<p>A simple REST API built with Node.js, Express, Mongoose and MongoDB to manage user creation and authentication with JSON web tokens.</p>

<h3>How to use it</h3>
<p>Clone the repo to your machine and run <code>npm install</code>. Make sure you have Node.js and MongoDB installed on your machine.
Create a <code>config.json</code> file in the root of the project. Your configuration object should be structured as follows:
<pre>
    {
        "test": {
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
        <code>GET: /</code>
        <p><b>example request:</b> <code>https://users-crud-api.herokuapp.com/</code></p>
        <p><b>description:</b> returns a 'Hello world' message, no authentication required.</p>
    </li>
    <li>
        <h4>List Users</h4> 
        <code>GET: /users</code>
        <p><b>example request:</b> <code>https://users-crud-api.herokuapp.com/users</code></p>
        <p><b>headers:</b> <code>key: x-auth, value: authentication_token</code></p>
        <p><b>description:</b> returns JSON object with all users. Authentication as 'Admin'is required.</p>
    </li>
    <li>
        <h4>Get User</h4> 
        <code>GET: /users/:id</code>
        <p><b>example request:</b> <code>https://users-crud-api.herokuapp.com/users/5b882d6b1e17a40014239236</code></p>
        <p><b>example headers:</b> <code>key: x-auth, value: authentication_token</code></p>
        <p><b>description:</b> returns JSON object with user data. Admins can access whatever user data, while users can only access their own data.</p>
    </li>
    <li>
        <h4>Add User (Sign Up)</h4> 
        <code>POST: /users/add</code>
        <p><b>example request:</b> <code>https://users-crud-api.herokuapp.com/users/add</code></p>
        <p><b>headers:</b> <code>key: Content-Type, value: application/json</code></p>
        <p><b>example body:</b> 
        <pre>
            {
                "userName": "Test User",
                "email": "john.doe@example.com",
                "password": "insecure-password",
                "role": "user"
            }
        </pre>
        </p>
        <p><b>description:</b> JSON with all users. Authentication as 'Admin'is required.</p>
    </li>
    <li>
        <h4>Login User (Sign In)</h4> 
        <code>POST: /users/login</code>
        <p><b>example request:</b> <code>https://users-crud-api.herokuapp.com/users/login</code></p>
        <p><b>headers:</b> </p>
            <p><code>key: Content-Type, value: application/json</code></p>
        <p><b>example body:</b> 
        <pre>
            {
                "email": "john.doe@example.com",
                "password": "insecure-password"
            }
        </pre>
        </p>
    </li>
        <h4>Logout User (Sign Out)</h4> 
        <code>POST: /users/logout/:id</code>
        <p><b>example request:</b> <code>https://users-crud-api.herokuapp.com/users/logout/5b86fde0ccb8100014444fe2</code></p>
        <p><b>headers:</b></p>
        <p><code>key: Content-Type, value: application/json</code></p>
        <p><code>key: x-auth, value: authentication_token</code></p>
        <p><b>example body:</b> 
        <pre>
            {
                "email": "john.doe@example.com",
                "password": "insecure-password"
            }
        </pre>
        </p>
    </li>
    </li>
        <h4>Delete User</h4> 
        <code>DELETE: /users/delete/:id</code>
        <p><b>example request:</b> <code>https://users-crud-api.herokuapp.com/users/delete/5b86e62f7f06ee00144a8070</code></p>
        <p><b>headers:</b> <code>key: x-auth, value: authentication_token</code></p>
        <p><b>description:</b> return JSON with deletion confirmation. Authentication as 'Admin'is required.</p>
    </li>
    /li>
        <h4>Update User</h4> 
        <code>PATCH: /users/update/5b85a0935c3f960014686a52</code>
        <p><b>example request:</b> <code>https://users-crud-api.herokuapp.com/users/update/5b85a0935c3f960014686a52</code></p>
        <p><b>headers:</b></p>
        <p><code>key: Content-Type, value: application/json</code></p>
        <p><code>key: x-auth, value: authentication_token</code></p>
        <p><b>example body:</b> 
        <pre>
            {
                "password": "insecure-password2"
            }
        </pre>
        </p>
        <p><b>description:</b> returns JSON with update confirmation. Admins can update whatever user data, while user can only update his/her own data.</p>
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
