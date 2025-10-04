const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const errorHandler = require('./helper/error-handler');

app.use(cors());
app.options('*', cors);

// Middleware
app.use(bodyParser.json());
app.use(express.json({ limit: '100mb',extended : true }));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true, parameterLimit:100000 })); 
app.use('/public/uploads/career_cv', express.static(__dirname + '/public/uploads/career_cv'));   
app.use('/public/uploads/invoices', express.static(__dirname + '/public/uploads/invoices'));    
app.use('/public/uploads/slider_img', express.static(__dirname + '/public/uploads/slider_img'));
app.use('/public/uploads/inspired_img', express.static(__dirname + '/public/uploads/inspired_img'));  
app.use('/public/uploads/product_img', express.static(__dirname + '/public/uploads/product_img'));
app.use('/public/uploads/branch_img', express.static(__dirname + '/public/uploads/branch_img'));  

app.use(morgan('tiny'));    

// Use authJwt middleware, excluding certain routes
/*app.use(authJwt().unless({ path: [
    { url: /\/api\/v1\/users\/login/, methods: ['POST'] },
    { url: /\/api\/v1\/users\/register/, methods: ['POST'] }
]}));*/

// Error handling middleware
app.use(errorHandler);

const api = process.env.API_URL;

const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const subcategoriesRouter = require('./routers/subcategories'); 
const subsubcategoriesRouter = require('./routers/subsubcategories');
const usersRouter = require('./routers/users');
const cityRouter = require('./routers/cities');
const storeRouter = require('./routers/stores');
const appointmentRouter = require('./routers/appointments');
const commonFormRouter = require('./routers/commonforms');
const contactRouter = require('./routers/contacts');
const careerRouter = require('./routers/careers');
const warrantyRouter = require('./routers/warranty');
const homesliderRouter = require('./routers/homesliders');
const inspiredCategoryRouter = require('./routers/inspiredcategories');
const inspiredRouter = require('./routers/inspireds');
const typeofproductRouter = require('./routers/typeofproducts');
const branchRouter = require('./routers/branchs');
const colorproductbucketRouter = require('./routers/colorproductbucket')

app.use(`${api}/products`, productsRouter); 
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/subcategories`, subcategoriesRouter);  
app.use(`${api}/subsubcategories`, subsubcategoriesRouter);  
app.use(`${api}/users`, usersRouter);  
app.use(`${api}/cities`, cityRouter);
app.use(`${api}/stores`, storeRouter)
app.use(`${api}/appointments`, appointmentRouter);
app.use(`${api}/commonforms`, commonFormRouter);
app.use(`${api}/contacts`, contactRouter);  
app.use(`${api}/careers`, careerRouter);
app.use(`${api}/warranty`, warrantyRouter);
app.use(`${api}/slider`, homesliderRouter);
app.use(`${api}/inspiredcategories`, inspiredCategoryRouter);
app.use(`${api}/inspireds`, inspiredRouter);    
app.use(`${api}/typeofproducts`, typeofproductRouter);
app.use(`${api}/branchs`, branchRouter);
app.use(`${api}/colorbuckets`, colorproductbucketRouter);


mongoose.set('debug', true);

mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log("Database connection is ready for work...");
    })
    .catch((error) => {
        console.log(error);
    });

app.listen(4000, () => {
    console.log('Server is running at http://localhost:4000');
});
  