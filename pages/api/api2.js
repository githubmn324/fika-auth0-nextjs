import { getSession, getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function api2(req, res) {
  try {
    console.log('api2 entering')
    const { accessToken } = await getAccessToken(req, res);
    const { idToken } = await getSession(req, res);
    
    console.log('accessToken: ' + accessToken)
    console.log('idToken: ' + idToken)
    // const expiredAccessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ii1OQWd5LUo1QnlsV084OXowTzlCbiJ9.eyJpc3MiOiJodHRwczovL2Rldi1ranF3dXE3Nno4c3VsZGd3LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NDJmZGMxNDk4YzNjM2VjMTM2NzVmZDYiLCJhdWQiOlsiaHR0cHM6Ly9mcy1hcGlndy1iZmYtbmFrYWdvbWUtYmk1YXhqMTQudWMuZ2F0ZXdheS5kZXYvIiwiaHR0cHM6Ly9kZXYta2pxd3VxNzZ6OHN1bGRndy51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjgxNDUxNTI2LCJleHAiOjE2ODE1Mzc5MjYsImF6cCI6Ik5IYTliaGhhUDQ2azRzRDd3cWRhYTgwZHNKR3p2MnlvIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsIm9yZ19pZCI6Im9yZ19qQ01NSHhOYk05Q0VManZwIn0.B56UDgp9FeJ95ZTZdTPN8f9hsUV3Xxb2Wko3n_2ZRRDnV1WTW4T6MW2V0sn7vNeTtv_IcSACaHX6_2ZLnMrcZrNKroWRpeNpzjwTRfdIhMUrJKxEnHrYqVdNslX7FE7S4pAuErMDErlcigrwdTcIeJB1Xk30nVEkQ9ujwmQGQ5RSCJVvKDGdEm2s_3Q0Vw6NQZ8osEuiezHiBOAl6K7Fyzp7LkXtBZziKRncFmKoNq9XIOnVUyiSkIth6jiASABalOhw0IQq-QLbh5HStVBaKh4mDtU4E3_3wPCHkceJ3hV4-FbwHqpQ7AuXIlRPEKMoEQwibOHoFXpkfK-blfw5sg"
    const apiPort = process.env.API_PORT || 3001;
    const response = await fetch(`http://localhost:${apiPort}/api/external/api2`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
          //Authorization: `Bearer ${idToken}`
        }
    });
    const api2 = await response.json();
    console.log(api2)
    res.status(200).json(api2);
  } catch (error) {
    console.log(error.status)
    console.log(error)
    res.status(error.status || 500).json({ error: error.message });
  }
});
