import InvariantError from "../../../exceptions/invariant-error.js";
import jabatanKaryawanRepository from "../repositories/jabatan_karyawan_repositories.js";

const getJabatanByKaryawan = async (req, res) => {
  const jabatanKaryawan =
    await jabatanKaryawanRepository.getJabatanByKaryawanId(req.user.id);

  res.status(200).json({
    status: "success",
    message: "Jabatan karyawan berhasil diambil",
    data: { jabatanKaryawan },
  });
};

const createJabatanKaryawan = async (req, res) => {
  const { jabatanId, karyawanId } = req.validatedBody;
  const jabatanKaryawan = await jabatanKaryawanRepository.createJabatanKaryawan(
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

export { createJabatanKaryawan, getJabatanByKaryawan };
