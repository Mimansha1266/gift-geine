import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { orderId } = await params;

    const order = await Order.findOne({
      orderId: orderId.toUpperCase(),
    }).select("-__v");

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch order error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to fetch order",
      },
      { status: 500 }
    );
  }
}