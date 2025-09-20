const { expressjwt: jwt } = require('express-jwt');

function authJwt() {
    const secret = process.env.SECRET;
    const api = process.env.API_URL;

    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            // Public uploaded files (fixed uploads path)
            { url: /^\/public\/upload\/color_image\/(.*)/, methods: ['GET', 'DELETE', 'POST', 'PUT', 'OPTIONS'] }, 
            { url: /^\/public\/upload\/attached_invoices\/(.*)/, methods: ['GET', 'DELETE', 'POST', 'PUT', 'OPTIONS'] },    
            { url: /^\/public\/upload\/slider_img\/(.*)/, methods: ['GET', 'DELETE', 'POST', 'PUT', 'OPTIONS'] },   
            { url: /^\/public\/upload\/inspired_img\/(.*)/, methods: ['GET', 'DELETE', 'POST', 'PUT', 'OPTIONS'] },  
            { url: /^\/public\/upload\/product_img\/(.*)/, methods: ['GET', 'DELETE', 'POST', 'PUT', 'OPTIONS'] }, 
            { url: /^\/public\/upload\/branch_img\/(.*)/, methods: ['GET', 'DELETE', 'POST', 'PUT', 'OPTIONS'] },
            
            // Public API routes
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'DELETE', 'POST', 'PUT', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'DELETE', 'POST', 'PUT', 'OPTIONS'] },
            { url: /\/api\/v1\/subcategories(.*)/, methods: ['GET', 'DELETE', 'POST', 'PUT', 'OPTIONS'] },
            { url: /\/api\/v1\/users(.*)/, methods: ['GET', 'DELETE', 'POST', 'PUT', 'OPTIONS'] },
            { url: /\/api\/v1\/catvideos(.*)/, methods: ['GET', 'DELETE', 'POST', 'PUT', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/add`
        ]
    });
}

async function isRevoked(req, payload, done) {
    try {
        if (!payload.isAdmin) {
            console.log(`Token revoked for user ${payload.userId}`);
            return done(null, true);
        }
        done();
    } catch (err) {
        console.error(`Error in isRevoked: ${err.message}`);
        done(err, true);
    }
}

module.exports = authJwt;
