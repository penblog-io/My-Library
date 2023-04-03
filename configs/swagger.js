const swaggerConfig = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My Library',
            version: '1.0.0',
            description: `<p>This is a demo of API microservice using ExpressJS, PassportJS with Local Strategy.
            that implement OAuth2 flow. There are 3 users and roles for this demo: admin, librarian, 
            reader with the follow permissions:<br/><br/>
            <strong>ADMIN</strong>: has full access to the APIs.<br/>
            <strong>LIBRARIAN</strong>: has full access to /api/books. can list all users and help user 
            update their first and last name.<br/>
            <strong>READER</strong>: can only view all books and update their own first and last name.
            <br/><br/>
            Users:<br/>
            username: <strong>admin</strong><br/>
            password: <strong>admin</strong><br/>
            <br/>
            username: <strong>librarian</strong><br/>
            password: <strong>librarian</strong><br/>
            <br/>
            username: <strong>reader</strong><br/>
            password: <strong>reader</strong><br/>
            <br/>
            Use /api/authorize with one of the users above to authenticate, then copy the JWT token 
            from the response and paste into the "Authorize" button.  
            </p>`
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./routes/*.js']
}

module.exports = swaggerConfig;

