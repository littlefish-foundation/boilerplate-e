"use client"
import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

const Test = async () => {
  const asset = "9b80f2ad359fcc76802228b0cac920ce41e30b50edf86a79658597c74c6974746c6546697368417574684e4654303031"
  const url = `https://cardano-preprod.blockfrost.io/api/v0/assets/${asset}`
  const apiKey = "preprodeJMSz33SUF1JhVnLi3BG8gSMVn2vKngf";

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'project_id': apiKey
    }
  })
  const data = await response.json()
  const sso = data.onchain_metadata.sso
  sso.isMaxUsageEnabled = 0
  if (sso.isMaxUsageEnabled == 1) {
    sso.isMaxUsageEnabled = true
  } else {
    sso.isMaxUsageEnabled = false
  }
  const ipfsUri = data.onchain_metadata.files[0].src

  const image = ipfsUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
  return image;
}

const SessionChecker = () => {
  const { user, loading } = useAuth()
  const [image, setImage] = useState(null)
  useEffect(() => {
    const getImage = async () => {
      const imageUrl = await Test();
      setImage(imageUrl);
    };
    getImage();
  }, []);

  if (loading) {
    return <div className='mt-16'>Loading...</div>
  }

  if (!user) {
    return (
      <>
        {image ? (
          <>
            <img className='mt-16' src={image} alt={"hehe"} width={500} height={500} />
          </>
        ) : (
          <p>Loading image...</p>
        )}
        <div className='mt-16'>You are not logged in</div>
      </>
    )
  }

  return (
    <div className='mt-16'>
      <p>Logged in as {user.walletAddress || user.email}</p>
      {user.walletNetwork && <p>Wallet Network: {user.walletNetwork}</p>}
      {user.verifiedPolicy && <p>Verified Policy: {user.verifiedPolicy}</p>}
    </div>
  )
}

export default SessionChecker