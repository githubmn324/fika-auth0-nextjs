import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Highlight from '../components/Highlight';
import Content from '../components/Content';

// next.jsが用意している外部から一度だけデータを取得してくるメソッド
export async function getStaticProps(){
  const apiPort = process.env.API_PORT || 3001;
  // get access token from m2m
  const response = await fetch(`http://localhost:${apiPort}/api/clientCredentials`, {
      method: 'POST',
  });
  const data = await response.json();
  const accessToken = data.access_token;
  // call api2
  const api2Response = await fetch(`http://localhost:${apiPort}/api/external/api2`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const api2ResponseData = await api2Response.json();
  const api2data = api2ResponseData.data
  return {
    props: {
      api2data
    }
  }  
}

// async function callApi2() {
//   console.log(`callApi2 called`);
//   try{
//     // get access token using client credentials from machien to machine app
//     const apiPort = process.env.API_PORT || 3001;
//     const response = await fetch(`http://localhost:${apiPort}/api/clientCredentials`, {
//         method: 'POST',
//     });
//     console.log({response: response});
//     const data = await response.json();
//     console.log({data: data});
//     const accessToken = data.access_token;
//     console.log({accessToken: accessToken})
//     // call api2
//     const api2Response = await fetch(`http://localhost:${apiPort}/api/external/api2`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     const api2ResponseData = await api2Response.json();
//     console.log({api2ResponseData: api2ResponseData})
//     return  api2ResponseData.data;
//   } catch (error) {
//     return null;
//   }    
// }

export default function Index(
  {api2data}
) {
  
  // // get data from GCP API2 through machine to machine app
  // const [data, setData] = useState(null);
  
  // useEffect(()=>{
  //   callApi2().then((data)=>{
  //     setData(JSON.stringify(data))
  //   });
  // }, []);
  
  return (
    <>
      <Hero />
      {/* {data && <Highlight>{JSON.stringify(data, null, 2)}</Highlight>}  */}
      {api2data && <Highlight>{JSON.stringify(api2data, null, 2)}</Highlight>} 
      <Content />
    </>
  );
}
