import Link from "next/link";
import React, { FormEvent, useState, useEffect } from "react";
import styles from "../styles/layout.module.css";
import utilStyles from "../styles/utils.module.css";
import homeStyles from "../styles/Home.module.css";

import { 
    createAuth0Organization,
    createM2MApp,
    createClientGrant,
    createCloudStorageHierarchy, 
    createFirestoreDocument 
} from "../lib/onboarding";
// firebase
import { signInFirebase, signOutFirebase } from '../Firebase/firebase';

export default function Admin() {
    
    const [progressMessage, setMessage] = useState("");

    const handleSubmit = async(event) => {
        event.preventDefault()
        
        let message = "";
        setMessage(message);
        
        try{
            // get form data
            const form = event.target;
            const orgDisplayName = form.tenantDisplayName.value;

            // get access token with scopes of read:organizations read:organizations_summary
            const cc_response = await fetch('/api/cc_apiExplorer');
            const cc_data = await cc_response.json();
            const accessToken = cc_data["access_token"];
            console.log({accessToken:accessToken})

            // create body data to create a new organization
            const createOrgData = {
                "name": form.tenantName.value,
                "display_name": orgDisplayName,
                "branding": {
                //   "logo_url": "",
                  "colors": {
                    "page_background": "#425fd1",
                    "primary": "#ffffff"
                  }
                }
            };
            const newOrgId = await createAuth0Organization(createOrgData, accessToken);
            message = message + `Auth0 Organization作成完了。newOrgId: ${newOrgId}\n`
            setMessage(message);
            
            // add the current authenticated user in the organization
            // verify organization id
            // check if user is in the organization
            // force login

            // create m2m organization
            const createM2MAppData = {
                "name": orgDisplayName + " M2M Application",
                "app_type": "non_interactive",
                "grant_types": [
                  "client_credentials"
                ],
                "token_endpoint_auth_method": "client_secret_post",
                "jwt_configuration": {
                  "alg": "RS256",
                  "lifetime_in_seconds": 36000,
                  "secret_encoded": false
                },
                "allowed_origins": [
                  "http://localhost:3000"
                ],
                "is_first_party": true,
                "refresh_token": {
                  "expiration_type": "non-expiring",
                  "leeway": 0,
                  "infinite_token_lifetime": true,
                  "infinite_idle_token_lifetime": true,
                  "token_lifetime": 31557600,
                  "idle_token_lifetime": 2592000,
                  "rotation_type": "non-rotating"
                },
                "allowed_clients": [],
                "allowed_logout_urls": [
                  "http://localhost:3000"
                ],
                "callbacks": [
                  "http://localhost:3000"
                ],
                "client_metadata": {
                  "org_id": newOrgId
                }
            };
            const client_id = await createM2MApp(createM2MAppData, accessToken);
            message = message + `Auth0 M2Mアプリ作成完了。client_id: ${client_id}\n`
            setMessage(message);

            // M2MアプリにAPI Gatewayを防御するAuth0 APIへのclient grantを作成
            const clientGrantData = {
                "client_id": client_id,
                "audience": "https://fs-apigw-bff-nakagome-bi5axj14.uc.gateway.dev/",
                "scope": []
            };
            const clientGrantId = await createClientGrant(clientGrantData, accessToken);
            message = message + `Auth0 M2MアプリのAPI有効化完了。clientGrantId: ${clientGrantId}\n`
            setMessage(message);
            
            
            await signInFirebase();
            // Cloud storage for firebase 階層追加
            const cloudStorageFullPath = await createCloudStorageHierarchy(newOrgId);
            message = message + `Cloud storage for firebase新規階層作成完了。cloudStorageFullPath: ${cloudStorageFullPath}\n`
            setMessage(message);

            // Firestore 階層追加
            // const firestoreFullPath = await createFirestoreDocument(newOrgId);
            // message = message + `Firestore新規階層 作成完了。firestoreFullPath: ${firestoreFullPath}\n`
            
            await createFirestoreDocument(newOrgId);
            message = message + `Firestore新規階層作成完了\n`
            setMessage(message);
            await signOutFirebase();

        }catch(error){
            console.debug({error: error, message: error.message});
            message = message + error.message;
            setMessage(message);
        }

    }
    
    return (
        <div>
            <h2 className={utilStyles.heading2Xl}>管理画面</h2>
            <section>
                <h3 className={utilStyles.headingXl}>新規テナント追加</h3>
                <p>テナント名・テナント表示名を入力し作成ボタンを押下して下さい。
                    以下オンボーディング時の一連の作業を実施します。</p>
                <ol>
                    <li>Auth0 Organization 作成</li>
                    <li>Auth0 M2Mアプリ 作成</li>
                    <li>Cloud storage for firebase新規階層 作成</li>
                    <li>Firestore新規階層 作成</li>
                </ol>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="tenantName">テナント名：</label>
                    <input type="text" id="tenantName" name="tenantName" required />
                    <br />
                    <label htmlFor="tenantDisplayName">テナント表示名：</label>
                    <input type="text" id="tenantDisplayName" name="tenantDisplayName" required />
                    <br />
                    <button type="submit">作成</button>
                </form>
                {progressMessage && <p className={utilStyles.message}>{progressMessage}</p>}
            </section>
        </div>
    );
}