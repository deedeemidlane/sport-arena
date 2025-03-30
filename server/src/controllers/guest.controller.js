import prisma from "../db/prisma.js";

export const getFields = async (req, res) => {
  try {
    const sportFields = await prisma.sportField.findMany({
      include: {
        owner: true,
      },
    });

    // console.log(user);

    if (sportFields) {
      res.status(200).json(sportFields);
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
    console.log("req params: ", req.params);

    const fieldId = req.params.fieldId;

    const field = await prisma.sportField.findUnique({
      where: { id: parseInt(fieldId) },
      include: {
        owner: true,
        orders: {
          include: {
            bookings: true,
          },
        },
      },
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
