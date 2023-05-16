require('dotenv').config({ path: './.env.local' });

const express = require('express');
const request = require('request'); //added 
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const app = express();
const port = process.env.API_PORT || 3001;
const baseUrl = process.env.AUTH0_BASE_URL;
const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL;
const audience = process.env.AUTH0_AUDIENCE;
const auth0Domain = process.env.AUTH0_DOMAIN;

// ログ出力用
const pino = require('pino');
const expressPino = require('express-pino-logger');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const expressLogger = expressPino({ logger });

if (!baseUrl || !issuerBaseUrl) {
  throw new Error('Please make sure that the file .env.local is in place and populated');
}

if (!audience) {
  console.log('AUTH0_AUDIENCE not set in .env.local. Shutting down API server.');
  process.exit(1);
}

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({ origin: baseUrl }));
app.use(expressLogger);

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${issuerBaseUrl}/.well-known/jwks.json`,
  }),
  audience: audience,
  issuer: `${issuerBaseUrl}/`,
  algorithms: ['RS256']
});

// Get access token from Auth0 Machine To Machine App
// app.post('/api/clientCredentials', checkJwt, async(req, res)=>{
app.post('/api/clientCredentials', async(req, res)=>{
  console.log('Fetching access token from https://' + auth0Domain + '/oauth/token');
  const options = {
    method: 'POST',
    url: 'https://' + auth0Domain + '/oauth/token',
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    },
    body: {
      audience: audience,
      grant_type: 'client_credentials',
      client_id: 'P8gvIPnXw3aezmsPiYj3fChVJzx3ygkI',
      client_secret: 'XzCuiDUGd_wQq7EBl3Kd-F2Y13MRDCQau-zluXYV7ldfvpCqB1ucCZfVVDKXVkbc',
      // org_id: "org_jCMMHxNbM9CELjvp"
    },
    json: true
  };
  request(options, function(error, response, body){
    if (error || response.statusCode < 200 || response.statusCode >= 300) {
      logger.debug('Fetching access token failed: ' + error);
      res.send(error)
    }
    console.log(body);
    res.send(body);
  });
})


app.get('/api/shows', checkJwt, (req, res) => {
  res.send({
    msg: 'Your access token was successfully validated!'
  });
});

const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./firebase/firebase-key');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

// auth0
app.post('/api/auth0/createOrg', async(req, res)=>{
  // logger.debug({
  //   message: "create Org entering",
  //   req: req
  // })
  console.log({
    message: "create Org entering",
    req: req
  });
  const response = await fetch(`${issuerBaseUrl}/api/v2/orgnizations`, {
      body: req.data,
      headers: {
        'Content-Type': 'application/json',    
      },
      method: req.method,
  })
  console.log({
    message: "create Org exiting",
    response: response
  });
  res.send({response})
})

app.post('/api/auth0/addMember', async(req, res)=>{
  console.log({
    message: "add member to the org entering",
    req: req
  });
  const id = req.orgId;
  const data = {
    members: [req.user]
  }   
  const response = await fetch(`${issuerBaseUrl}/api/v2/organizations/${id}/members`, {
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json',    
    },
    method: 'POST',
  })
  res.json({response})
  console.log({
    message: "add member to the org exiting",
    response: response
  });
})

// firebase
app.get('/api/firebase', checkJwt, async (req, res) => {
  logger.debug("### /api/firebase");
  // const {sub: uid} = req.user;
  const {sub: uid} = req.auth;
  console.log("### req.auth");
  console.dir(req.auth, { depth: null })
  console.log(`### req.auth: ${uid}`);
  
  const additionalClaims = {
    org_id: req.auth.org_id,
  };

  try {
      const firebaseToken = await firebaseAdmin.auth().createCustomToken(uid, additionalClaims);
      res.json({firebaseToken})
      console.log({
        firebaseToken: firebaseToken
      });
  } catch (err) {
      res.status(500).send({
      message: 'Firebase トークンを取得するときにエラーが発生しました。',
      error: err
    });
  }
});

app.get("/api/external/workflow", checkJwt, (req, res) => {
  request.get({
      uri: `${audience}/bff/workflow`,
      headers: {'Authorization': req.get('Authorization')},
      qs: {
        // GETのURLの後に付く?hoge=hugaの部分
      },
      json: true
  }, function(err, req, data){
      res.send({
        data
      });
  });
});

app.get("/api/external/api2", (req, res) => {
// app.get("/api/external/api2", checkJwt, (req, res) => {
  request.get({
      uri: `${audience}/bff/api2`,
      headers: {'Authorization': req.get('Authorization')},
      qs: {
        // GETのURLの後に付く?hoge=hugaの部分
      },
      json: true
  }, function(err, req, data){
      console.log(err)
      res.send({
        data
      });
  });
});

const server = app.listen(port, () => console.log(`API Server listening on port ${port}`));
process.on('SIGINT', () => server.close());
