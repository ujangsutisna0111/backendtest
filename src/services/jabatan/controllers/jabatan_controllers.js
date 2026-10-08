import jabatanRepository from "../repositories/jabatan_repositories.js";
import NotFoundError from "../../../exceptions/notfound-error.js";

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

const updateJabatan = async (req, res) => {
  const jabatan = await jabatanRepository.updateJabatan(
    req.validatedParams.jabatanId,
    req.validatedBody,
  );

  if (!jabatan) {
    throw new NotFoundError("Jabatan tidak ditemukan");
  }

  res.status(200).json({
    status: "success",
    message: "Jabatan berhasil diperbarui",
    data: { jabatan },
  });
};

const deleteJabatan = async (req, res) => {
  const jabatan = await jabatanRepository.deleteJabatan(
    req.validatedParams.jabatanId,
  );

  if (!jabatan) {
    throw new NotFoundError("Jabatan tidak ditemukan");
  }

  res.status(200).json({
    status: "success",
    message: "Jabatan berhasil dihapus",
    data: { jabatan },
  });
};

export {
  createJabatan,
  deleteJabatan,
  getJabatan,
  getJabatanById,
  updateJabatan,
};
