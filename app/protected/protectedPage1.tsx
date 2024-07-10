
export default async function ProtectedPage1(props: { policyID: string }) {
    return (
        <div>
            <h1>Protected Page 1</h1>
            <p>This is a protected page. You can only see this if you are logged in with an asset with policyID: {props.policyID}</p>
        </div>
    );
}