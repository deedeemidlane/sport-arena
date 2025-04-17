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
          include: {
            bookings: {
              orderBy: [{ bookingDate: "asc" }, { startTime: "asc" }],
            },
            sportField: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

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
      include: {
        bookings: {
          orderBy: [{ bookingDate: "asc" }, { startTime: "asc" }],
        },
        sportField: true,
        review: true,
      },
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
              startTime: slot.time,
            },
          }),
        ),
      );

      const totalPrice = bookingSlots
        .filter((slot) => slot.selected)
        .reduce((acc, slot) => acc + slot.price, 0);

      await prisma.payment.create({
        data: {
          orderId: newOrder.id,
          amount: totalPrice,
          method: "BANKTRANSFER",
          status: "PENDING",
        },
      });

      res.status(201).json({ message: "Đặt sân thành công!" });
    } else {
      res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in placeOrder controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const orderId = JSON.parse(req.body.orderId);

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: "SELF_CANCELED" },
    });

    if (updatedOrder) {
      res.status(200).json({ message: "Huỷ đơn đặt sân thành công" });
    } else {
      res.status(404).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in cancelOrder controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const confirmRefund = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const orderId = JSON.parse(req.body.orderId);

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: "FINISHED" },
    });

    if (updatedOrder) {
      await prisma.payment.delete({
        where: { orderId: updatedOrder.id },
      });

      res.status(200).json({ message: "Xác nhận hoàn tiền thành công" });
    } else {
      res.status(404).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in confirmRefund controller: ", error.message);
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

export const createMatchRequest = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const { bookingId, desiredLevel } = JSON.parse(req.body.data);
    console.log("bookingId: ", bookingId);
    console.log("desiredLevel: ", desiredLevel);
    // return;

    const newMatchRequest = await prisma.matchRequest.create({
      data: {
        userId: req.payload.id,
        bookingId: parseInt(bookingId),
        desiredLevel: desiredLevel,
        status: "OPEN",
      },
    });

    if (newMatchRequest) {
      res.status(201).json({ message: "Tạo yêu cầu đặt sân thành công!" });
    } else {
      res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in createMatchRequest controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const getCreatedMatchRequests = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const matchRequests = await prisma.matchRequest.findMany({
      where: { userId: req.payload.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        booking: {
          include: {
            order: {
              include: { sportField: true },
            },
          },
        },
        match: {
          where: { isRejected: false },
          include: { opponent: true },
        },
      },
    });

    if (matchRequests) {
      res.status(200).json(matchRequests);
    } else {
      res.status(404).json({ error: "Không tìm thấy tài nguyên" });
    }
  } catch (error) {
    console.log("Error in getMyMatchRequests controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const getOtherMatchRequests = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const { sportType, province, district, level, gender, date } = req.query;

    const matchRequests = await prisma.matchRequest.findMany({
      where: {
        userId: { not: req.payload.id },
        status: "OPEN",
        match: {
          none: {
            opponentId: parseInt(req.payload.id),
          },
        },
        booking: {
          ...(date && { bookingDate: date }),
          order: {
            sportField: {
              ...(sportType && { sportType: sportType }),
              ...(province && { province: province }),
              ...(district && { district: district }),
            },
          },
        },
        ...(level && { desiredLevel: level }),
        user: {
          ...(gender && { gender }),
        },
      },
      include: {
        user: true,
        booking: {
          include: {
            order: {
              include: { sportField: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (matchRequests) {
      const now = new Date();
      now.setHours(now.getHours());
      const validMatchRequests = [];

      matchRequests.forEach(async (request) => {
        const bookingDate = new Date(request.booking.bookingDate);
        const [hour] = request.booking.startTime.split(":").map(Number);
        const bookingStartTime = new Date(
          bookingDate.getTime() + hour * 60 * 60 * 1000,
        );

        if (bookingStartTime > now) {
          validMatchRequests.push(request);
        } else {
          await prisma.matchRequest.update({
            where: { id: request.id },
            data: { status: "CLOSED" },
          });
        }
      });

      // res.status(200).json(matchRequests);
      res.status(200).json(validMatchRequests);
    } else {
      res.status(404).json({ error: "Không tìm thấy tài nguyên" });
    }
  } catch (error) {
    console.log("Error in getOtherMatchRequests controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const getSendedMatchRequests = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const matchs = await prisma.match.findMany({
      where: {
        opponentId: parseInt(req.payload.id),
      },
      orderBy: { createdAt: "desc" },
      include: {
        matchRequest: {
          include: {
            user: true,
            booking: {
              include: {
                order: {
                  include: { sportField: true },
                },
              },
            },
          },
        },
      },
    });

    if (matchs) {
      res.status(200).json(
        matchs.map((match) => ({
          ...match,
          status: match.isRejected ? "REJECTED" : match.matchRequest.status,
        })),
      );
    } else {
      res.status(404).json({ error: "Không tìm thấy tài nguyên" });
    }
  } catch (error) {
    console.log("Error in getSendedMatchRequests controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const requestMatch = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const matchRequestId = JSON.parse(req.body.matchRequestId);

    // Fetch the current match request
    const currentMatchRequest = await prisma.matchRequest.findUnique({
      where: { id: parseInt(matchRequestId) },
      include: {
        booking: true,
      },
    });

    if (!currentMatchRequest) {
      return res.status(404).json({ error: "Không tìm thấy yêu cầu ghép cặp" });
    }

    // Fetch created and sent match requests of the current user
    const createdMatchRequests = await prisma.matchRequest.findMany({
      where: { userId: req.payload.id },
      include: { booking: true },
    });

    const sendedMatchRequests = await prisma.match.findMany({
      where: { opponentId: req.payload.id, isRejected: false },
      include: {
        matchRequest: {
          include: { booking: true },
        },
      },
    });

    const hasOverlap = [...createdMatchRequests, ...sendedMatchRequests].some(
      (request) => {
        const booking = request.booking || request.matchRequest?.booking;
        if (!booking) return false;

        return (
          booking.bookingDate === currentMatchRequest.booking.bookingDate &&
          booking.startTime === currentMatchRequest.booking.startTime
        );
      },
    );

    if (hasOverlap) {
      return res.status(400).json({
        error: "Không thể bắt cặp do bạn đã có cặp đấu khác ở khung giờ này.",
      });
    }

    const newMatch = await prisma.match.create({
      data: {
        matchRequestId: parseInt(matchRequestId),
        opponentId: req.payload.id,
      },
    });

    if (newMatch) {
      const updatedMatchRequest = await prisma.matchRequest.update({
        where: { id: parseInt(matchRequestId) },
        data: { status: "PROCESSING_REQUEST" },
      });

      await prisma.notification.create({
        data: {
          userId: updatedMatchRequest.userId,
          title: "Bạn có yêu cầu ghép cặp đấu",
          message: `<b>${req.payload.name}</b> vừa yêu cầu ghép cặp đấu với bạn.`,
          isRead: false,
          link: `/created-match-requests?status=PROCESSING_REQUEST`,
        },
      });

      res.status(200).json({
        message:
          "Gửi yêu cầu bắt cặp thành công! Vui lòng chờ đối thủ xác nhận.",
      });
    } else {
      res.status(404).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in requestMatch controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const acceptMatchRequest = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const matchRequestId = JSON.parse(req.body.matchRequestId);
    const opponentId = JSON.parse(req.body.opponentId);

    const updatedMatchRequest = await prisma.matchRequest.update({
      where: { id: parseInt(matchRequestId) },
      data: { status: "PROCESSING_PAYMENT" },
    });

    if (updatedMatchRequest) {
      const creator = await prisma.user.findUnique({
        where: { id: updatedMatchRequest.userId },
      });
      await prisma.notification.create({
        data: {
          userId: parseInt(opponentId),
          title: "Yêu cầu ghép cặp đã được xác nhận.",
          message: `<b>${creator.name}</b> đã đồng ý ghép cặp. Vui lòng thanh toán tiền cọc để hoàn tất thủ tục ghép cặp.`,
          isRead: false,
          link: `/sended-match-requests?status=PROCESSING_PAYMENT`,
        },
      });

      res.status(200).json({
        message: "Xác nhận ghép cặp! Vui lòng chờ đối thủ đặt cọc.",
      });
    } else {
      res.status(404).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in acceptMatchRequest controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const rejectMatchRequest = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const matchRequestId = JSON.parse(req.body.matchRequestId);
    const opponentId = JSON.parse(req.body.opponentId);

    const updatedMatchRequest = await prisma.matchRequest.update({
      where: { id: parseInt(matchRequestId) },
      data: { status: "OPEN" },
    });

    if (updatedMatchRequest) {
      await prisma.match.update({
        where: {
          opponentId: parseInt(opponentId),
          matchRequestId: parseInt(matchRequestId),
        },
        data: {
          isRejected: true,
        },
      });
      const creator = await prisma.user.findUnique({
        where: { id: updatedMatchRequest.userId },
      });
      await prisma.notification.create({
        data: {
          userId: parseInt(opponentId),
          title: "Yêu cầu ghép cặp đã bị huỷ",
          message: `<b>${creator.name}</b> đã huỷ yêu cầu ghép cặp của bạn. Hãy tìm đối thủ phù hợp hơn.`,
          isRead: false,
          link: `/sended-match-requests?status=REJECTED`,
        },
      });

      res.status(200).json({ message: "Đã huỷ yêu cầu!" });
    } else {
      res.status(404).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in rejectMatchRequest controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const deposit = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const imagePath = req.file.path;

    const imageUrl = imagePath.slice(
      imagePath.lastIndexOf(
        "/",
        imagePath.indexOf("/" + req.file.filename) - 1,
      ) + 1,
    );

    const matchId = JSON.parse(req.body.matchId);

    const updatedMatch = await prisma.match.update({
      where: { id: parseInt(matchId) },
      data: { proofImageUrl: imageUrl },
    });

    if (updatedMatch) {
      const matchRequest = await prisma.matchRequest.findUnique({
        where: { id: updatedMatch.matchRequestId },
      });
      await prisma.notification.create({
        data: {
          userId: matchRequest.userId,
          title: "Kiểm tra tiền cọc",
          message: `<b>${req.payload.name}</b> đã thanh toán tiền cọc. Vui lòng kiểm tra và xác nhận.`,
          isRead: false,
          link: `/created-match-requests?status=PROCESSING_PAYMENT`,
        },
      });

      res.status(200).json({ message: "Đặt cọc thành công!" });
    } else {
      res.status(404).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in deposit controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const confirmDeposit = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const matchRequestId = JSON.parse(req.body.matchRequestId);
    const opponentId = JSON.parse(req.body.opponentId);

    const updatedMatchRequest = await prisma.matchRequest.update({
      where: { id: parseInt(matchRequestId) },
      data: { status: "MATCHED" },
    });

    if (updatedMatchRequest) {
      const creator = await prisma.user.findUnique({
        where: { id: updatedMatchRequest.userId },
      });
      await prisma.notification.create({
        data: {
          userId: parseInt(opponentId),
          title: "Ghép cặp thành công",
          message: `<b>${creator.name}</b> đã xác nhận thanh toán. Ghép cặp hoàn tất!`,
          isRead: false,
          link: `/sended-match-requests?status=MATCHED`,
        },
      });

      res.status(200).json({
        message: "Ghép cặp thành công!",
      });
    } else {
      res.status(404).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in confirmDeposit controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const createReview = async (req, res) => {
  try {
    if (req.payload.role !== "CUSTOMER") {
      return res
        .status(401)
        .json({ error: "Unauthorized - Not customer token" });
    }

    const { rating, comment, sportFieldId, orderId } = JSON.parse(
      req.body.data,
    );

    // Validate input
    if (!sportFieldId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }

    // Check if the sport field exists
    const sportField = await prisma.sportField.findUnique({
      where: { id: parseInt(sportFieldId) },
    });

    if (!sportField) {
      return res.status(404).json({ error: "Sân đấu không tồn tại" });
    }

    // Create the review
    const newReview = await prisma.review.create({
      data: {
        userId: req.payload.id,
        sportFieldId: parseInt(sportFieldId),
        orderId: parseInt(orderId),
        rating: parseInt(rating),
        comment,
      },
    });

    if (newReview) {
      res.status(201).json({ message: "Cảm ơn bạn đã gửi đánh giá!" });
    } else {
      res.status(400).json({ error: "Gửi đánh giá thất bại" });
    }
  } catch (error) {
    console.log("Error in createReview controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};
