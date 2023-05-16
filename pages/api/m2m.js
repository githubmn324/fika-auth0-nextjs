import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function m2m(req, res) {
  try {
    console.log('m2m entering')
    const { accessToken } = await getAccessToken(req, res);
    console.log('accessToken: ' + accessToken)
    const apiPort = process.env.API_PORT || 3001;
    const response = await fetch(`http://localhost:${apiPort}/api/external/api2`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
    });
    const m2m = await response.json();
    console.log(m2m)
    res.status(200).json(m2m);
  } catch (error) {
    console.log(error.status)
    console.log(error)
    res.status(error.status || 500).json({ error: error.message });
  }
});
