"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, use } from "react";
import moneyFormater from "@/lib/utils/moneyFormater";
import Button from "@/components/primary/Button";
import { Check, X } from "lucide-react";

export default function Success({ searchParams }) {
  const searchParams_ = useSearchParams();
  const { session_id: sessionId } = use(searchParams);
  const [paymentStatus, setPaymentStatus] = useState();
  const [customerName, setCustomerName] = useState();
  const [paymentAmount, setPaymentAmount] = useState();
  const [referenceNumber, setReferenceNumber] = useState();
  const [bookingId, setBookingId] = useState();
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    async function fecthCheckoutInfo() {
      try {
        const res = await fetch(
          `/api/v1/bookings/success?session_id=${sessionId}`,
          {
            method: "GET",
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setPaymentStatus(data.paymentStatus);
        setCustomerName(data.customerName);
        setPaymentAmount(data.paymentAmount);
        setReferenceNumber(data.referenceNumber);
        setBookingId(data.bookingId);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }

    fecthCheckoutInfo();
  }, [sessionId]);

  async function handleModalVisibility() {
    setModalIsOpen(!modalIsOpen);
  }

  async function cancelBooking() {
    // const res = await fetch(`/api/v1/bookings/${bookingId}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-300"></div>
      </div>
    );
  }

  return (
    <div className="dark:text-easyDark h-full flex flex-col justify-center items-center p-4">
      {paymentStatus == "CONFIRMED" ? (
        <div className="lg:w-1/3 flex flex-col items-center gap-6 -3 py-6">
          <div className="flex flex-col justify-center text-center gap-6">
            <p className="text-3xl md:text-4xl font-bold tracking-wide">
              Booking Confirmed!
            </p>
            <div className="tracking-wider max-w-lg mx-auto">
              <p>
                Hi {String(customerName).split(" ")[0]}, thank you for choosing
                us! Your reservation is confirmed. If there is anything you need
                before your appointment, please don not hesitate to reach us out
                through the email bellow:
              </p>
              <a
                href="mailto:info@aestheticsbydrhendler.com.au"
                className="cursor-pointer text-primary-300 hover:text-primary-500 transition-all duration-300"
              >
                info@aestheticsbydrhendler.com.au
              </a>
            </div>
          </div>

          <div className="sm:min-w-lg">
            <p className="text-xl md:text-2xl font-bold tracking-widest text-center ">
              Payment Details
            </p>
            <div className="mt-3">
              <div className="flex justify-between mt-1">
                <p className="font-bold">Deposit Paid</p>
                <p className="tracking-wide ml-3">
                  ${moneyFormater(paymentAmount)}
                </p>
              </div>
              <div className="flex justify-between mt-1">
                <p className="font-bold">Date</p>
                <p className="tracking-wide ml-3">17/09/2025</p>
              </div>
              <div className="flex justify-between mt-1">
                <p className="font-bold">Time</p>
                <p className="tracking-wide ml-3">09:30 am</p>
              </div>
              <div className="flex justify-between mt-1">
                <p className="font-bold">Reference Number</p>
                <p className="tracking-wide ml-3 uppercase">
                  {referenceNumber}
                </p>
              </div>
              <div className="flex justify-between mt-1">
                <p className="font-bold">Service</p>
                <p className="tracking-wide ml-3">Anti Wrinkle Treatment</p>
              </div>
              <div className="flex justify-between mt-1">
                <p className="font-bold">Address</p>
                <address className="tracking-wide ml-3">
                  North Bondi, 2026, Sydney NSW
                </address>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-lg font-bold ">Cancellation Policy</p>
              <p className="text-sm">
                Appointments cancelled within 24 hours will forfeit the full
                deposit. <br />
                To cancel your appointment, please{" "}
                <button
                  onClick={handleModalVisibility}
                  className="text-primary-500 underline tracking-wide cursor-pointer"
                >
                  click here
                </button>{" "}
                or email us at{" "}
                <a
                  href="mailto:info@aestheticsbydrhendler.com.au"
                  className="text-primary-500 underline tracking-wide"
                >
                  info@aestheticsbydrhendler.com.au
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>Sorry, something went wrong</div>
      )}

      {modalIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative z-10 mx-4 rounded-md border border-white/20 bg-white/20 p-6 shadow-xl text-center fade-in">
            <h2 className="text-xl font-semibold text-white">
              Booking Cancellation
            </h2>
            <p className="mt-1 text-sm text-gray-200 tracking-wide">
              Please confirm if you really wish to cancel your booking.
            </p>

            <div className="mt-6 flex gap-3 justify-center">
              <Button buttonType="confirmInverse" onClick={cancelBooking}>
                <Check size={20} /> Yes
              </Button>
              <Button buttonType="decline" onClick={handleModalVisibility}>
                <X size={20} />
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
