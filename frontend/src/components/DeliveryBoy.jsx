import { useEffect, useState } from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import { ClipLoader } from "react-spinners";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function DeliveryBoy() {
  const { userData, socket } = useSelector((state) => state.user);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [availableAssignments, setAvailableAssignments] = useState(null);
  const [otp, setOtp] = useState("");
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!socket || userData.role !== "deliveryBoy") return;
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setDeliveryBoyLocation({ lat: latitude, lon: longitude });
          socket.emit("updateLocation", {
            latitude,
            longitude,
            userId: userData._id,
          });
        },
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
        }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, userData]);

  const ratePerDelivery = 50;
  const totalEarning = todayDeliveries.reduce(
    (sum, d) => sum + d.count * ratePerDelivery,
    0
  );

  const getAssignments = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-assignments`,
        { withCredentials: true }
      );
      setAvailableAssignments(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        { withCredentials: true }
      );
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true }
      );
      await getCurrentOrder();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("newAssignment", (data) => {
      setAvailableAssignments((prev) => [...prev, data]);
    });
    return () => {
      socket.off("newAssignment");
    };
  }, [socket]);

  const sendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
        },
        { withCredentials: true }
      );
      setLoading(false);
      setShowOtpBox(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const verifyOtp = async () => {
    setMessage("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp,
        },
        { withCredentials: true }
      );
      setMessage(result.data.message);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-today-deliveries`,
        { withCredentials: true }
      );
      setTodayDeliveries(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAssignments();
    getCurrentOrder();
    handleTodayDeliveries();
  }, [userData]);

  return (
    <div className="w-screen min-h-screen flex flex-col bg-[#fff9f6] overflow-y-auto">
      <Nav />
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10 py-8 px-2">

        {/* Welcome & Location Card */}
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col justify-center items-center border border-orange-100 text-center gap-2 mb-2">
            <h1 className="text-xl font-bold text-[#ff4d2d]">Welcome, {userData.fullName}</h1>
            <p className="text-[#ff4d2d]"><span className="font-semibold">Latitude:</span> {deliveryBoyLocation?.lat}, <span className="font-semibold">Longitude:</span> {deliveryBoyLocation?.lon}</p>
          </div>

          {/* Today's Earnings Card */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col justify-center items-center border border-orange-100 text-center">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Today's Earning</h1>
            <span className="text-4xl font-bold text-green-600">₹{totalEarning}</span>
          </div>
        </div>

        {/* Today's Deliveries Bar Chart */}
        <div className="w-full bg-white rounded-2xl shadow-md p-6 border border-orange-100 mb-1">
          <h1 className="text-lg font-bold mb-4 text-[#ff4d2d]">
            Today Deliveries
          </h1>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={todayDeliveries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => [value, "orders"]} labelFormatter={(label) => `${label}:00`} />
              <Bar dataKey="count" fill="#ff4d2d" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Available Orders (if none in progress) */}
        {!currentOrder && (
          <div className="w-full bg-white rounded-2xl shadow-md p-6 border border-orange-100">
            <h1 className="text-lg font-bold mb-5 flex items-center gap-2">Available Orders</h1>
            <div className="grid gap-4">
              {availableAssignments?.length > 0 ? (
                availableAssignments.map((a, index) => (
                  <div className="border rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4" key={index}>
                    <div className="mb-2 md:mb-0">
                      <p className="text-base font-semibold">{a?.shopName}</p>
                      <p className="text-sm text-gray-500"><span className="font-semibold">Delivery Address:</span> {a?.deliveryAddress.text}</p>
                      <p className="text-xs text-gray-400">{a.items.length} items | {a.subtotal}</p>
                    </div>
                    <button
                      className="bg-orange-500 text-white px-5 py-2 rounded-lg text-base font-semibold transition hover:bg-orange-600"
                      onClick={() => acceptOrder(a.assignmentId)}
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No Available Orders</p>
              )}
            </div>
          </div>
        )}

        {/* Current Order (when active) */}
        {currentOrder && (
          <div className="w-full bg-white rounded-2xl shadow-md p-6 border border-orange-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">📦 Current Order</h2>
            <div className="border rounded-lg p-4 mb-5">
              <p className="font-semibold text-base">{currentOrder?.shopOrder.shop.name}</p>
              <p className="text-sm text-gray-500">{currentOrder.deliveryAddress.text}</p>
              <p className="text-xs text-gray-400">{currentOrder.shopOrder.shopOrderItems.length} items | {currentOrder.shopOrder.subtotal}</p>
            </div>

            <DeliveryBoyTracking
              data={{
                deliveryBoyLocation:
                  deliveryBoyLocation || {
                    lat: userData.location.coordinates[1],
                    lon: userData.location.coordinates[0],
                  },
                customerLocation: {
                  lat: currentOrder.deliveryAddress.latitude,
                  lon: currentOrder.deliveryAddress.longitude,
                },
              }}
            />

            {!showOtpBox ? (
              <button
                className="mt-6 w-full bg-green-500 text-white font-semibold py-3 px-2 rounded-xl shadow-md hover:bg-green-600 transition"
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? <ClipLoader size={20} color="white" /> : "Mark As Delivered"}
              </button>
            ) : (
              <div className="mt-6 p-5 border rounded-xl bg-gray-50">
                <p className="text-base font-semibold mb-4">
                  Enter OTP sent to <span className="text-orange-500">{currentOrder.user.fullName}</span>
                </p>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter OTP"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                />
                {message && (
                  <p className="text-center text-green-400 text-xl mb-4">
                    {message}
                  </p>
                )}
                <button
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                  onClick={verifyOtp}
                >
                  Submit OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryBoy;
