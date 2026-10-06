
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      orderId,
      trackingNumber,
      customerName,
      customerEmail,
      productName,
      courierName,
      status,
      estimatedDelivery,
    } = body;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
        },
        { status: 400 }
      );
    }

    const existingOrder = await Order.findOne({
      orderId: orderId.toUpperCase(),
    });

    if (existingOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "This Order ID already exists",
        },
        { status: 409 }
      );
    }

    const order = await Order.create({
      orderId,
      trackingNumber,
      customerName,
      customerEmail,
      productName,
      courierName,
      status,
      estimatedDelivery,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to create order",
      },
      { status: 500 }
    );
  }
}