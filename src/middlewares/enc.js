import encAes from "../security/enc-aes.js";
import ClientError from "../exceptions/client-error.js";

const encDecodeParam = (req, res, next) => {
  const ciphertext = req.params.jabatanId;

  const ivHeader = req.headers["x-aes-iv"];
  if (!ciphertext || !ivHeader) {
    throw new ClientError("Bad request");
  }

  const result = encAes.decode(ivHeader, ciphertext);

  if (!result) throw new ClientError("Bad request");

  req.dataDecrypt = result;
  next();
};

export default encDecodeParam;
