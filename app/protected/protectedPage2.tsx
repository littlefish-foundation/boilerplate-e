
export default async function ProtectedPage2(props: { policyID: string }) {
    return (
        <div>
            <h1>Protected Page 2</h1>
            <p>This is a protected page. You can only see this if you are logged in with an asset with policyID: {props.policyID}</p>
        </div>
    );
}