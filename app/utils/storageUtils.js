import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";

const secretKey = "delMontedelMonte";

function getStableBrowserFingerprint() {
  return `${navigator.userAgent}:${navigator.language}:${navigator.platform}`;
}

function getSessionId() {
  let sessionId = window.sessionStorage.getItem("sessionId");
  if (!sessionId) {
    const browserFingerprint = getStableBrowserFingerprint();
    sessionId = `${uuidv4()}-${browserFingerprint}`;
    window.sessionStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}

export function encryptData(data) {
  const sessionId = getSessionId();
  const combinedData = { data, sessionId };
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

    const { data, sessionId } = JSON.parse(decryptedData);

    const currentSessionId = getSessionId();

    if (sessionId !== currentSessionId) {
      console.error(
        "Session ID mismatch detected. This data may have been copied to another browser or session."
      );
      handleSessionTampering();
      return null;
    }

    return data;
  } else {
    console.error("Data integrity check failed!");
    handleSessionTampering();
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
    } else {
      handleSessionTampering();
    }
  }
}

function handleSessionTampering() {
  console.warn("Potential session tampering detected. Clearing session.");
  window.sessionStorage.clear();
  // window.location.href = "/";
}