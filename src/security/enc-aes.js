import crypto from "crypto";
const encAes = {
  decode(ivHeader, value) {
    const KEY_STRING = process.env.APP_SECRET_KEY;
    try {
      const key = Buffer.from(KEY_STRING, "utf8");
      const iv = Buffer.from(ivHeader, "hex");

      const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

      let decrypted = decipher.update(value, "base64", "utf8");
      decrypted += decipher.final("utf8");

      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Eror decode BE:", error.message);
      return null;
    }
  },
};

export default encAes;
