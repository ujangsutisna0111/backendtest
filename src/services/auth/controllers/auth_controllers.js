import AuthenticationError from "../../../exceptions/authentication-error.js";
import authRepository from "../repositories/auth_repositories.js";
import TokenManager from "../../../security/token-manager.js";
import jabatanKaryawanRepository from "../../jabatan_karyawan/repositories/jabatan_karyawan_repositories.js";

const register = async (req, res) => {
  const user = await authRepository.addUser(req.validatedBody);

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: { user },
  });
};

const login = async (req, res) => {
  const user = await authRepository.verifyUser(req.validatedBody);

  if (!user) {
    throw new AuthenticationError("Invalid username or password");
  }

  const jabatanKaryawan =
    await jabatanKaryawanRepository.getJabatanByKaryawanId(user.id);
  console.log(jabatanKaryawan);
  const role = jabatanKaryawan.map(({ jabatan }) => jabatan);
  console.log(role);

  res.status(200).json({
    status: "success",
    message: "Login successful",
    data: {
      accessToken: TokenManager.generateAccessToken({
        id: user.id,
        username: user.username,
        role,
      }),
    },
  });
};

export { login, register };
