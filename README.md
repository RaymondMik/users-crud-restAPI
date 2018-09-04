<h2>Users CRUD Restful API</h2>
<h3>- This document it is not yet completed! -</h3>
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

<h3>Deploying to Heroku</h3>
<p>This project is already set up to be deployed to Heroku. In order to do so you should:</p>
<ol>
    <li>Create an application on <a href="https://devcenter.heroku.com/articles/git" target="blank">Heroku</a></li>
    <li>Install mongolab addon to your Heroku app in order to use MongoDB</li>
    <li>Add a Heroku configuration variable for your JWT_SECRET code <code>config:set JWT_SECRET=your_jwt_secret_key</code></li>
    <li>Deploy to Heroku</li>
</ol>

<h3>Testing</h3>
<p><code>users</code> route is fully tested using <a href="https://github.com/visionmedia/supertest" target="blank">Jest</a> and <a href="https://github.com/visionmedia/supertest" target="blank">Supertest</a> super-agent driven library. Run <code>npm run test</code> to run the Jest test suite.</p>
