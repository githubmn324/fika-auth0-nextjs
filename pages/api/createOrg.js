import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function createOrg(req, res) {
  try {
    console.log({
      message: "createOrg entering"
    })
    const apiPort = process.env.API_PORT || 3001;
    const { accessToken } = await getAccessToken(req, res, {
      scopes: ['create:organizations', 'create:organization_connections']
    });
    const response = await fetch(`http://localhost:${apiPort}/api/auth0/createOrg`, {
        method: req.method,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }, 
        body: req.body
    });
    console.log(response)
    // const result = await response.json();
    res.status(200).json(response);

  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});
