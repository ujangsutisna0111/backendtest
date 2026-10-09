import jabatanRepository from "../../jabatan/repositories/jabatan_repositories.js";

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
    next(new InvariantError("Karyawan atau jabatan tidak ditemukan"));
  }

  res.status(201).json({
    status: "success",
    message: "Jabatan karyawan berhasil dibuat",
    data: { jabatanKaryawan },
  });
};

export { getJabatanByKaryawan, createJabatanKaryawan };
