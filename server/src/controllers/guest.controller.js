import prisma from "../db/prisma.js";

export const getFields = async (req, res) => {
  try {
    console.log("query: ", req.query);

    const { fieldName, sportType, province, district, minPrice, maxPrice } =
      req.query;

    const sportFields = await prisma.sportField.findMany({
      where: {
        ...(fieldName && {
          name: { contains: fieldName, mode: "insensitive" },
        }),
        ...(sportType && { sportType: sportType }),
        ...(province && { province: province }),
        ...(district && { district: district }),
        ...(minPrice &&
          maxPrice && {
            minPrice: {
              gte: parseInt(minPrice),
              lte: parseInt(maxPrice),
            },
          }),
        ...(minPrice &&
          !maxPrice && {
            minPrice: {
              gte: parseInt(minPrice),
            },
          }),
        ...(maxPrice &&
          !minPrice && {
            minPrice: {
              lte: parseInt(maxPrice),
            },
          }),
      },
      include: {
        owner: true,
        reviews: true,
      },
    });

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
    const fieldId = req.params.fieldId;

    const field = await prisma.sportField.findUnique({
      where: { id: parseInt(fieldId) },
      include: {
        owner: true,
        services: true,
        reviews: { include: { user: true } },
        fieldTimes: {
          orderBy: { startTime: "asc" },
        },
        orders: {
          include: {
            bookings: true,
          },
        },
      },
    });

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
