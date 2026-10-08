import menuRepository from "../repositories/menu_repositories.js";
import ForbiddenError from "../../../exceptions/forbidden_error.js";

const createMenu = async (req, res) => {
  const menu = await menuRepository.createMenu(req.validatedBody);

  res.status(201).json({
    status: "success",
    message: "Menu berhasil dibuat",
    data: { menu },
  });
};

const getMenus = async (_req, res) => {
  const menus = await menuRepository.getMenus();

  res.status(200).json({
    status: "success",
    message: "Daftar menu berhasil diambil",
    data: { menus },
  });
};

const getMenuAccessByJabatan = async (req, res, next) => {
  const { jabatanId } = req.validatedParams;
  const isRoleExist = req.user.roles.some(
    (role) => role.jabatan_id === jabatanId,
  );
  if (!isRoleExist) {
    next(new ForbiddenError());
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

export { createMenu, createMenuAccess, getMenuAccessByJabatan, getMenus };
