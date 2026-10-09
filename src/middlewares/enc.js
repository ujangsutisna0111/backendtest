import crypto from "crypto";
import response from "../utils/response.js";

const encDecode = (req, res, next) => {
  const ciphertext = req.params.jabatanId;


  const ivDariHeader = req.headers["x-aes-iv"];
  if (!ciphertext || !ivDariHeader) {
    return response(400, failed, "Bad request");
  }

  const KEY_STRING = process.env.APP_SECRET_KEY;
  try {
    const key = Buffer.from(KEY_STRING, "utf8");
    const iv = Buffer.from(ivDariHeader, "hex");

    const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

    let decrypted = decipher.update(ciphertext, "base64", "utf8");
    decrypted += decipher.final("utf8");

    const result = JSON.parse(decrypted);
  
    req.dataDecrypt = result;
    next();
  } catch (error) {
    console.error("Eror decode BE:", error.message);
    return res.status(400).json({ message: "Bad request " });
  }
};

export default encDecode;
