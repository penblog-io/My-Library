const roleConfig = {
    ADMIN: {
        permissions: {
            '/api/users': {
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                scope: 'ALL'
            },
            '/api/books': {
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                scope: 'ALL'
            }
        }
    },
    LIBRARIAN: {
        permissions: {
            '/api/users': {
                methods: ['GET', 'PATCH'],
                scope: 'ALL'
            },
            '/api/books': {
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                scope: 'ALL'
            }
        }
    },
    READER: {
        permissions: {
            '/api/users': {
                methods: ['GET', 'PATCH'],
                scope: 'SELF'
            },
            '/api/books': {
                methods: ['GET'],
                scope: 'ALL'
            }
        }
    }
};

module.exports = roleConfig;