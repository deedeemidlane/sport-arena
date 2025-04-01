import prisma from "../db/prisma.js";

export const getOrders = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.payload.id },
      include: {
        orders: {
          include: { bookings: true, sportField: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // console.log(user);

    if (user && user.orders) {
      res.status(200).json({ orders: user.orders });
    } else {
      res.status(404).json({ error: "Không tìm thấy tài nguyên" });
    }
  } catch (error) {
    console.log("Error in getOrders controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const getOrderDetail = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const orderId = req.params.orderId;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { bookings: true, sportField: true },
    });

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: "Không tìm thấy tài nguyên" });
    }
  } catch (error) {
    console.log("Error in getOrderDetail controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const placeOrder = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    console.log("req body: ", req.body);

    console.log("req file: ", req.file);

    const imagePath = req.file.path;

    const imageUrl = imagePath.slice(
      imagePath.lastIndexOf(
        "/",
        imagePath.indexOf("/" + req.file.filename) - 1,
      ) + 1,
    );

    const fieldId = JSON.parse(req.body.fieldId);
    const bookingSlots = JSON.parse(req.body.bookingSlots);
    const customerInfo = JSON.parse(req.body.customerInfo);

    const newOrder = await prisma.order.create({
      data: {
        userId: req.payload.id,
        sportFieldId: parseInt(fieldId),
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        proofImageUrl: imageUrl,
        status: "PENDING",
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

      res.status(201).json({ message: "Đặt sân thành công!" });
    } else {
      res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in placeOrder controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: req.payload.id },
      orderBy: { createdAt: "desc" },
    });

    console.log("notifications: ", notifications);

    if (notifications) {
      res.status(200).json({ notifications });
    } else {
      res.status(404).json({ error: "Không tìm thấy tài nguyên" });
    }
  } catch (error) {
    console.log("Error in getNotifications controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const readNotification = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const { notificationId } = req.params;

    const notification = await prisma.notification.update({
      where: { id: parseInt(notificationId) },
      data: { isRead: true },
    });

    if (notification) {
      res.status(200).json({ message: "Success" });
    } else {
      res.status(404).json({ error: "Error" });
    }
  } catch (error) {
    console.log("Error in readNotification controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};
