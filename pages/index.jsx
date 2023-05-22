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
  const api2Response = await fetch(`http://localhost:${apiPort}/api/external/api2-v2`, {
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


export default function Index({
  api2data
}) {  
  return (
    <>
      <Hero />
      {/* {data && <Highlight>{JSON.stringify(data, null, 2)}</Highlight>}  */}
      {api2data && <Highlight>{JSON.stringify(api2data, null, 2)}</Highlight>} 
      <Content />
    </>
  );
}
