import menuRepository from "../repositories/menu_repositories.js";

const createMenu = async (req, res) => {
  const menu = await menuRepository.createMenu(req.validatedBody);

  res.status(201).json({
    status: "success",
    message: "Menu berhasil dibuat",
    data: { menu },
  });
};


export { createMenu };
