import Link from "next/link";
import React, { FormEvent, useState } from "react";
import styles from "../styles/layout.module.css";
import utilStyles from "../styles/utils.module.css";
import homeStyles from "../styles/Home.module.css";

export default function Admin() {
    const [newOrgId, setNewOrgId] = useState(null);
    const handleSubmit = async(event) => {
        event.preventDefault()
        
        try{
            // create organization
            const form = event.target;
            const data = {
                "name": form.tenantName.value,
                "display_name": form.tenantDisplayName.value,
                "branding": {
                  "logo_url": "",
                  "colors": {
                    "primary": "",
                    "page_background": ""
                  }
                },
                "metadata": {},
                "enabled_connections": [
                "object"
                ]
            };
            const JSONdata = JSON.stringify(data);
            const response = await fetch('/api/createOrg', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSONdata,
            });
            console.log({
                response: response
            })
            const result = await response.json();
            setNewOrgId(result.id);
            
            // add the current authenticated user in the organization
            // verify organization id
            // check if user is in the organization
            // force login

        }catch(error){
            console.debug(error);
        }
        
    }

    return (
        <div>
            <h2 className={utilStyles.heading2Xl}>管理画面</h2>
            <section>
                <h3 className={utilStyles.headingXl}>新規テナント追加</h3>
                <p>Auth0に対して、organizationの追加を行います。</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="tenantName">テナント名：</label>
                    <input type="text" id="tenantName" name="tenantName" required />
                    <br />
                    <label htmlFor="tenantDisplayName">テナント表示名：</label>
                    <input type="text" id="tenantDisplayName" name="tenantDisplayName" required />
                    <button type="submit">作成</button>
                </form>
                <p>新規テナントID: {newOrgId}</p>
            </section>
        </div>
    );
}