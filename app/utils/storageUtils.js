import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";

const secretKey = "delMontedelMonte";

function getBrowserFingerprint() {
  return `${navigator.userAgent}:${window.screen.width}x${window.screen.height}:${navigator.language}`;
}

function getSessionId() {
  let sessionId = window.sessionStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = uuidv4();
    window.sessionStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}

export function encryptData(data) {
  const browserFingerprint = getBrowserFingerprint();
  const sessionId = getSessionId();
  const combinedData = { data, fingerprint: browserFingerprint, sessionId };
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(combinedData),
    secretKey
  ).toString();
  const hmac = CryptoJS.HmacSHA256(encryptedData, secretKey).toString();
  return `${encryptedData}:${hmac}`;
}


export function decryptData(encryptedDataWithHmac) {
  const [retrievedEncryptedData, retrievedHmac] =
    encryptedDataWithHmac.split(":");
  const validHmac = CryptoJS.HmacSHA256(
    retrievedEncryptedData,
    secretKey
  ).toString();

  if (retrievedHmac === validHmac) {
    const decryptedData = CryptoJS.AES.decrypt(
      retrievedEncryptedData,
      secretKey
    ).toString(CryptoJS.enc.Utf8);

    const { data, fingerprint, sessionId } = JSON.parse(decryptedData);

    if (
      fingerprint !== getBrowserFingerprint() ||
      sessionId !== getSessionId()
    ) {
      console.error(
        "Browser fingerprint or session ID mismatch. Data may have been tampered with, copied to another browser, or different browser context."
      );
      return null;
    }

    return data;
  } else {
    console.error("Data integrity check failed!");
    return null;
  }
}

export function storeData(key, data) {
  if (data === null || data === undefined) {
    handleSessionTampering();
  } else {
    const encryptedData = encryptData(data);
    window.sessionStorage.setItem(key, encryptedData);
  }
}

export function retrieveData(key) {
  const encryptedDataWithHmac = window.sessionStorage.getItem(key);
  if (encryptedDataWithHmac) {
    const decryptedData = decryptData(encryptedDataWithHmac);
    if (decryptedData === null) {
      handleSessionTampering();
    }
    return decryptedData;
  }
  return null;
}

export function removeData(key) {
  const encryptedDataWithHmac = window.sessionStorage.getItem(key);
  if (encryptedDataWithHmac) {
    const decryptedData = decryptData(encryptedDataWithHmac);
    if (decryptedData !== null) {
      window.sessionStorage.removeItem(key);
      console.log(`Data associated with key '${key}' has been removed.`);
    } else {
      handleSessionTampering();
    }
  } else {
    console.warn(`No data found for key '${key}'.`);
  }
}


function handleSessionTampering() {
  window.sessionStorage.clear();
  // window.location.href = "/";
}