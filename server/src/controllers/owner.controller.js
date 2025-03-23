import prisma from "../db/prisma.js";

export const getFields = async (req, res) => {
  try {
    if (req.payload.role !== "OWNER") {
      return res.status(401).json({ error: "Unauthorized - Not owner token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.payload.id },
      include: {
        sportFields: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    // console.log(user);

    if (user && user.sportFields) {
      res.status(200).json({ fields: user.sportFields });
    } else {
      res.status(404).json({ error: "Không tìm thấy tài nguyên" });
    }
  } catch (error) {
    console.log("Error in getFields controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const getFieldDetail = async (req, res) => {
  try {
    if (req.payload.role !== "OWNER") {
      return res.status(401).json({ error: "Unauthorized - Not owner token" });
    }

    console.log("req params: ", req.params);

    const fieldId = req.params.fieldId;

    const field = await prisma.sportField.findUnique({
      where: { id: parseInt(fieldId) },
    });

    // console.log(field);
    // return;

    if (field) {
      res.status(200).json(field);
    } else {
      res.status(404).json({ error: "Không tìm thấy tài nguyên" });
    }
  } catch (error) {
    console.log("Error in getFieldDetail controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const createField = async (req, res) => {
  try {
    if (req.payload.role !== "OWNER") {
      return res.status(401).json({ error: "Unauthorized - Not owner token" });
    }
    console.log("req body: ", req.body);

    console.log("req file: ", req.file);

    const imagePath = req.file.path;

    /* Shorten url:
      'https://res.cloudinary.com/.../image/upload/v1725527707/insorder-menu/uxicwxymg6pruk9ersmj.webp'
      -> 'v1725527707/insorder-menu/uxicwxymg6pruk9ersmj.webp'
    */

    const imageUrl = imagePath.slice(
      imagePath.lastIndexOf(
        "/",
        imagePath.indexOf("/" + req.file.filename) - 1,
      ) + 1,
    );
    const data = JSON.parse(req.body.data);

    const newField = await prisma.sportField.create({
      data: {
        ownerId: req.payload.id,
        ...data,
        imageUrl: imageUrl,
      },
    });

    console.log("new field: ", newField);

    if (newField) {
      res.status(201).json({ message: "Thêm sân thành công!" });
    } else {
      res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in createField controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const updateField = async (req, res) => {
  try {
    if (req.payload.role !== "OWNER") {
      return res.status(401).json({ error: "Unauthorized - Not owner token" });
    }

    console.log("req params: ", req.params);

    console.log("req body: ", req.body);

    // return;

    console.log("req file: ", req.file);

    const imagePath = req.file.path;

    /* Shorten url:
      'https://res.cloudinary.com/.../image/upload/v1725527707/insorder-menu/uxicwxymg6pruk9ersmj.webp'
      -> 'v1725527707/insorder-menu/uxicwxymg6pruk9ersmj.webp'
    */

    const imageUrl = imagePath.slice(
      imagePath.lastIndexOf(
        "/",
        imagePath.indexOf("/" + req.file.filename) - 1,
      ) + 1,
    );

    const fieldId = req.params.fieldId;
    const data = JSON.parse(req.body.data);

    const updateField = await prisma.sportField.update({
      where: { id: parseInt(fieldId) },
      data: {
        ...data,
        imageUrl: imageUrl,
      },
    });

    if (updateField) {
      res.status(201).json({ message: "Cập nhật thông tin sân thành công!" });
    } else {
      res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in getFieldDetail controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};
