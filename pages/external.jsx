import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Highlight from '../components/Highlight';

function External() {
  const [state, setState] = useState({ isLoading: false, response: undefined, error: undefined });

  const callApi1 = async () => {
    setState(previous => ({ ...previous, isLoading: true }))

    try {
      const response = await fetch('/api/workflow');  
      const data = await response.json();
      console.log({
          method: "call workflow",
          result: response,
          data: data
      })
      setState(previous => ({ ...previous, response: data, error: undefined }))
    } catch (error) {
      setState(previous => ({ ...previous, response: undefined, error }))
    } finally {
      setState(previous => ({ ...previous, isLoading: false }))
    }
  };
  const callApi2 = async () => {
    setState(previous => ({ ...previous, isLoading: true }))

    try {
      // API2のレスポンス
      const response = await fetch('/api/api2');  
      const data = await response.json();
      console.log({
          method: "call api2",
          result: response,
          data: data
      })

      setState(previous => ({ ...previous, response: data, error: undefined }))
    } catch (error) {
      setState(previous => ({ ...previous, response: undefined, error }))
    } finally {
      setState(previous => ({ ...previous, isLoading: false }))
    }
  };

  const handle = (event, fn) => {
    event.preventDefault();
    fn();
  };

  const { isLoading, response, error } = state;

  return (
    <>
      <div className="mb-5" data-testid="external">
        <h1 data-testid="external-title">External API</h1>
        {/* <div data-testid="external-text">
          <p className="lead">
            Ping an external API by clicking the button below
          </p>
          <p>
          This will call a local API on port 3001 that would have been started if you run <code>npm run dev</code>.
          </p>
          <p>
          An access token is sent as part of the request's <code>Authorization</code> header and the API will validate
          it using the API's audience value. The audience is the identifier of the API that you want to call (see{" "}
          <a href="https://auth0.com/docs/get-started/dashboard/tenant-settings#api-authorization-settings">
            API Authorization Settings
          </a>{" "}
          for more info).
          </p>
        </div> */}
        <div data-testid="external-text">
          <p className="lead">
            .env.localファイルに記載されたaudienceの値をもとに取得したアクセストークンでアクセスする。
          </p>
        </div>
        <Button color="primary" className="mt-5" onClick={e => handle(e, callApi1)} data-testid="external-action">
        API Gateway → BFF → Workflow → API1
        </Button>
        <br />
        <Button color="primary" className="mt-5" onClick={e => handle(e, callApi2)} data-testid="external-action">
          API Gateway → BFF → API2
        </Button>
      </div>
      <div className="result-block-container">
        {isLoading && <Loading />}
        {(error || response) && (
          <div className="result-block" data-testid="external-result">
            <h6 className="muted">Result</h6>
            {error && <ErrorMessage>{error.message}</ErrorMessage>}
            {response && <Highlight>{JSON.stringify(response, null, 2)}</Highlight>}
          </div>
        )}
      </div>
    </>
  );
}

export default withPageAuthRequired(External, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
