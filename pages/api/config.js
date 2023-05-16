export default function config(req, res) {
  try{
    // 可変長の引数を返す際に有効なスプレッド構文を使用
    const configData = {
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      audience: process.env.AUTH0_AUDIENCE 
      // ... others
      // ...(process.env.AUTH0_AUDIENCE ? { audience } : null),
    };
    res.status(200).json(configData);
  }catch(err){
    console.log(err)
  }
}
