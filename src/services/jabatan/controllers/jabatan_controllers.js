import jabatanRepository from "../repositories/jabatan_repositories.js";
import InvariantError from "../../../exceptions/invariant-error.js";
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

const getJabatanByKaryawan = async (req, res) => {
  const jabatanKaryawan = await jabatanRepository.getJabatanByKaryawanId(
    req.user.id,
  );

  res.status(200).json({
    status: "success",
    message: "Jabatan karyawan berhasil diambil",
    data: { jabatanKaryawan },
  });
};

const createJabatanKaryawan = async (req, res) => {
  const { jabatanId, karyawanId } = req.validatedBody;
  const jabatanKaryawan = await jabatanRepository.createJabatanKaryawan(
    karyawanId,
    jabatanId,
  );

  if (!jabatanKaryawan) {
    throw new InvariantError("Karyawan atau jabatan tidak ditemukan");
  }

  res.status(201).json({
    status: "success",
    message: "Jabatan karyawan berhasil dibuat",
    data: { jabatanKaryawan },
  });
};

export {
  createJabatan,
  createJabatanKaryawan,
  getJabatan,
  getJabatanById,
  getJabatanByKaryawan,
};
