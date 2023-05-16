import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function workflow(req, res) {
  try {
    console.log('workflow entering')
    const { accessToken } = await getAccessToken(req, res);
    console.log('accessToken: ' + accessToken)
    const apiPort = process.env.API_PORT || 3001;
    const response = await fetch(`http://localhost:${apiPort}/api/external/workflow`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
    });
    const workflow = await response.json();
    console.log(workflow)
    res.status(200).json(workflow);
  } catch (error) {
    console.log(error.status)
    console.log(error)
    res.status(error.status || 500).json({ error: error.message });
  }
});
