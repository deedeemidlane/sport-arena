import prisma from "../db/prisma.js";

export const getFields = async (req, res) => {
  try {
    const sportFields = await prisma.sportField.findMany({
      include: {
        owner: true, // Assuming 'user' is the relation name in your Prisma schema
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

export const getFieldDetail = async (req, res) => {};
