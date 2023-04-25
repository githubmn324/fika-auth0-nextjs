import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';

import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Highlight from '../components/Highlight';
import { Button } from 'reactstrap';

// firebase
import { db, signInFirebase, signOutFirebase } from '../Firebase/firebase'
// firestore
import { collection, getDocs } from "firebase/firestore";

function Firestore() {
  const { user, isLoading } = useUser();
  const [restaurantsList, setRestaurantsList] = useState(false);

  async function getRestaurants() {
    console.log("### getResturants");
    await signInFirebase();
    const restaurantsCol = collection(db, 'restaurants');
    const restaurantsSnapshot = await getDocs(restaurantsCol);
    const restaurantsList = restaurantsSnapshot.docs.map(doc => doc.data());
    console.log("### restaurantsList");
    console.dir(restaurantsList, { depth: null }) 

    setRestaurantsList(restaurantsList);
    signOutFirebase();
}

  return (
    <>
      {isLoading && <Loading />}
      {user && (
        <>
          <Row className="align-items-center profile-header mb-5 text-center text-md-left" data-testid="profile">
            <Col md={2}>
              <img
                src={user.picture}
                alt="Profile"
                className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                decode="async"
                data-testid="profile-picture"
              />
            </Col>
            <Col md>
              <h2 data-testid="profile-name">{user.name}</h2>
              <p className="lead text-muted" data-testid="profile-email">
                {user.email}
              </p>
            </Col>
          </Row>
          <Row data-testid="profile-json">
            <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
          </Row>
          <Row className="align-items-center profile-header mb-5 text-center text-md-left">
              <Button
                  color="primary"
                  className="mt-5"
                  onClick={getRestaurants}
              >
                  Get Restaurants 
              </Button>
          </Row>
          <Row>
              <Highlight>{JSON.stringify(restaurantsList, null, 2)}</Highlight>
          </Row>
        </>
      )}
    </>
  );
}

export default withPageAuthRequired(Firestore, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
