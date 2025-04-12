import prisma from "../db/prisma.js";
import cloudinary from "../configs/cloudinaryConfig.js";

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

    const fieldId = req.params.fieldId;

    const field = await prisma.sportField.findUnique({
      where: { id: parseInt(fieldId) },
      include: {
        services: true,
        owner: true,
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

export const createField = async (req, res) => {
  try {
    if (req.payload.role !== "OWNER") {
      return res.status(401).json({ error: "Unauthorized - Not owner token" });
    }
    console.log("req body: ", req.body);

    console.log("req file: ", req.file);

    let newField = undefined;

    if (req.file) {
      const imagePath = req.file.path;

      const imageUrl = imagePath.slice(
        imagePath.lastIndexOf(
          "/",
          imagePath.indexOf("/" + req.file.filename) - 1,
        ) + 1,
      );
      const data = JSON.parse(req.body.data);

      newField = await prisma.sportField.create({
        data: {
          ownerId: req.payload.id,
          ...data,
          imageUrl: imageUrl,
        },
      });
    } else {
      newField = await prisma.sportField.create({
        data: {
          ownerId: req.payload.id,
          ...data,
        },
      });
    }

    if (newField) {
      const services = JSON.parse(req.body.services);
      await Promise.all(
        services.map((service) =>
          prisma.extraService.create({
            data: {
              sportFieldId: newField.id,
              name: service.name,
              price: parseInt(service.price),
            },
          }),
        ),
      );

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
    console.log("req file: ", req.file);

    const fieldId = req.params.fieldId;

    const currentField = await prisma.sportField.findFirst({
      where: { id: parseInt(fieldId) },
    });
    const currentImageUrl = currentField.imageUrl;

    const data = JSON.parse(req.body.data);

    let updatedField = undefined;
    let imageUrl = undefined;

    if (req.file) {
      const imagePath = req.file.path;

      imageUrl = imagePath.slice(
        imagePath.lastIndexOf(
          "/",
          imagePath.indexOf("/" + req.file.filename) - 1,
        ) + 1,
      );

      updatedField = await prisma.sportField.update({
        where: { id: parseInt(fieldId) },
        data: { ...data, imageUrl: imageUrl },
      });
    } else {
      updatedField = await prisma.sportField.update({
        where: { id: parseInt(fieldId) },
        data: { ...data },
      });
    }

    if (updatedField) {
      const services = JSON.parse(req.body.services);

      await prisma.extraService.deleteMany({
        where: { sportFieldId: updatedField.id },
      });

      await Promise.all(
        services.map((service) =>
          prisma.extraService.create({
            data: {
              sportFieldId: updatedField.id,
              name: service.name,
              price: parseInt(service.price),
            },
          }),
        ),
      );

      if (updatedField.imageUrl === "") {
        const imagePublicId = currentImageUrl.substring(
          currentImageUrl.indexOf("/") + 1,
          currentImageUrl.lastIndexOf("."),
        );

        await cloudinary.uploader.destroy(imagePublicId);
      }

      res.status(200).json({ message: "Cập nhật thông tin sân thành công!" });
    } else {
      res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in getFieldDetail controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const getOrders = async (req, res) => {
  try {
    if (req.payload.role !== "OWNER") {
      return res.status(401).json({ error: "Unauthorized - Not owner token" });
    }

    const orders = await prisma.order.findMany({
      where: {
        sportField: {
          ownerId: req.payload.id,
        },
        orderType: "NORMAL_BOOKING",
      },
      include: {
        sportField: true,
        bookings: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (orders) {
      res.status(200).json({ orders });
    } else {
      res.status(404).json({ error: "Không tìm thấy đơn hàng nào" });
    }
  } catch (error) {
    console.log("Error in getFields controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    if (req.payload.role !== "OWNER") {
      return res.status(401).json({ error: "Unauthorized - Not owner token" });
    }

    console.log("req params: ", req.params);
    console.log("req body: ", req.body);

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(req.params.orderId) },
      data: { status: req.body.status },
      include: { sportField: true },
    });

    if (updatedOrder) {
      if (updatedOrder.status === "CONFIRMED") {
        await prisma.notification.create({
          data: {
            userId: updatedOrder.userId,
            title: "Đơn đã xác nhận!",
            message: `Đơn đặt sân tại <b>${updatedOrder.sportField.name}</b> đã được xác nhận!`,
            isRead: false,
            link: `/orders/${updatedOrder.id}`,
          },
        });
        res.status(200).json({ message: "Đã xác nhận đơn đặt!" });
      } else {
        await prisma.notification.create({
          data: {
            userId: updatedOrder.userId,
            title: "Đơn đã huỷ!",
            message: `Đơn đặt sân tại <b>${updatedOrder.sportField.name}</b> đã bị huỷ!`,
            isRead: false,
            link: `/orders/${updatedOrder.id}`,
          },
        });
        res.status(200).json({ message: "Đã huỷ đơn đặt!" });
      }
    } else {
      res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in updateOrderStatus controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const preBook = async (req, res) => {
  try {
    if (req.payload.role !== "OWNER") {
      return res.status(401).json({ error: "Unauthorized - Not owner token" });
    }

    console.log("req body: ", req.body);

    const fieldId = JSON.parse(req.body.fieldId);
    const bookingSlots = JSON.parse(req.body.bookingSlots);

    // console.log("fieldId: ", fieldId);
    // console.log("bookingSlots: ", bookingSlots);

    const newOrder = await prisma.order.create({
      data: {
        userId: req.payload.id,
        sportFieldId: parseInt(fieldId),
        customerName: "",
        customerPhone: "",
        proofImageUrl: "",
        status: "CONFIRMED",
        orderType: "OWNER_PREBOOKING",
      },
    });

    if (newOrder) {
      // Create bookings for each slot
      await Promise.all(
        bookingSlots.map((slot) =>
          prisma.booking.create({
            data: {
              orderId: newOrder.id,
              fieldNo: slot.fieldIndex,
              bookingDate: slot.date,
              price: slot.price,
              startTime: parseInt(slot.time),
            },
          }),
        ),
      );

      res.status(201).json({ message: "Giữ chỗ thành công!" });
    } else {
      res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in updateOrderStatus controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};
