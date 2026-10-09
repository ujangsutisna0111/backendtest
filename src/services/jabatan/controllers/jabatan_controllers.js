import jabatanRepository from "../repositories/jabatan_repositories.js";
import NotFoundError from "../../../exceptions/notfound-error.js";
import ClientError from "../../../exceptions/client-error.js";
import Forbidden from "../../../exceptions/forbidden_error.js";
import menuRepository from "../../menu/repositories/menu_repositories.js";
import ForbiddenError from "../../../exceptions/forbidden_error.js";
const createJabatan = async (req, res) => {
  const jabatan = await jabatanRepository.createJabatan(req.validatedBody);

  res.status(201).json({
    status: "success",
    message: "Jabatan berhasil dibuat",
    data: { jabatan },
  });
};

const getJabatan = async (_req, res) => {
  const jabatan = await jabatanRepository.getJabatan();

  res.status(200).json({
    status: "success",
    message: "Daftar jabatan berhasil diambil",
    data: { jabatan },
  });
};

const getJabatanById = async (req, res) => {
  const jabatan = await jabatanRepository.getJabatanById(
    req.validatedParams.jabatanId,
  );

  if (!jabatan) {
    throw new NotFoundError("Jabatan tidak ditemukan");
  }

  res.status(200).json({
    status: "success",
    message: "Jabatan berhasil diambil",
    data: { jabatan },
  });
};

const getMenuAccessByJabatan = async (req, res) => {
  const { jabatanId } = req.dataDecrypt;

  if (!jabatanId) {
    throw new ClientError("Id Jabatan tidak valid");
  }
  const isRoleExist = req.user.roles.some(
    (role) => role.jabatan_id === jabatanId,
  );
  if (!isRoleExist) {
    throw new ForbiddenError();
  } else {
    const menus = await menuRepository.getMenuAccessByJabatan(jabatanId);

    res.status(200).json({
      status: "success",
      message: "Akses menu berdasarkan jabatan berhasil diambil",
      data: { menus },
    });
  }
};
const createMenuAccess = async (req, res) => {
  const menuAccess = await menuRepository.createMenuAccess(req.validatedBody);

  res.status(201).json({
    status: "success",
    message: "Akses menu berhasil dibuat",
    data: { menuAccess },
  });
};

export {
  createJabatan,
  getJabatan,
  getJabatanById,
  getMenuAccessByJabatan,
  createMenuAccess,
};
