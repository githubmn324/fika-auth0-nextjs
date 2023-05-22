import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function createOrg(req, res) {
  try {
    console.log({
      message: "createOrg entering",
      authorizationheaders: req.headers.authorization,
      body: req.body
    })
    const accessToken = req.headers.authorization;
    const apiPort = process.env.API_PORT || 3001;

    // const { accessToken } = await getAccessToken(req, res, {
      // user needs to sign in again とエラーになる
      // scopes: ['create:organizations', 'create:organization_connections']
    // });
    console.log({message: "fetch from client side", accessToken: accessToken})
    const response = await fetch(`http://localhost:3000/api/auth0/organizations`, {
    // バックエンドからManagement APIを呼び出すとcertificateエラーが発生する。
    // const response = await fetch(`http://localhost:${apiPort}/api/auth0/createOrg`, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.authorization,
        },
        body: req.body
    });
    const result = await response.json();
    console.log({result: result})
    res.status(200).send(result);
  } catch (error) {
    console.log({
      status: error.status, 
      error: error.message
    })
    res.status(error.status || 500).json({ error: error.message });
  }
});
