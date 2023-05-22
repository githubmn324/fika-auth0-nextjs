import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function cc_apiExplorer(req, res) {
  try {
    console.log('cc_apiExplorer entering')
    const apiPort = process.env.API_PORT || 3001;
    const response = await fetch(`http://localhost:${apiPort}/api/clientCredentials/apiExplorer`, {
        method: 'POST',
    });
    const cc_apiExplorer = await response.json();
    console.log(cc_apiExplorer)
    res.status(200).json(cc_apiExplorer);
  } catch (error) {
    console.log(error.status)
    console.log(error)
    res.status(error.status || 500).json({ error: error.message });
  }
});
