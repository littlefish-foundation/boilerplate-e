import React, { useState } from "react";
import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";

function SignMessage() {
    const { signMessage } = useCardano();
    const [message, setMessage] = useState("");
    const [signature, setSignature] = useState("");
    const [error, setError] = useState("");

    const handleSignMessage = async () => {
        try {
            await signMessage(message, (signature, key) => {
                setSignature(signature);
                setError('');
            }, (error) => {
                setError(error.message);
                setSignature('');
            }
            );
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter a message to sign"
      />
      <button onClick={handleSignMessage}>Sign Message</button>
      {signature && <div>Signature: {signature}</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
    )
}

export default SignMessage;