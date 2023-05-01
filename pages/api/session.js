import { getAccessToken, withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function (req, res) {
  try {    
    const session = await getSession(req, res);
    res.status(200).json(session);

  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }

});