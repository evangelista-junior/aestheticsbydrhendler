"use client";

import { useEffect, useState, use } from "react";
import moneyFormater from "@/lib/utils/moneyFormater";
import Button from "@/components/ui/Button";
import { Check, X } from "lucide-react";
import { useParams } from "next/navigation";
import { checkIsRefundable } from "@/lib/business/booking/cancellation";

export default function Success({ searchParams }) {
  const { bookingId } = useParams();
  const [status, setStatus] = useState();
  const [amount, setAmount] = useState();
  const [name, setName] = useState();
  const [providerRef, setProviderRef] = useState();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [service, setService] = useState();
  const [isRefundable, setIsRefundable] = useState();
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    async function fecthCheckoutInfo() {
      try {
        const res = await fetch(`/api/v1/bookings/${bookingId}`, {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        const checkRefundability = checkIsRefundable({
          bookingDate: data.date,
          bookingTime: data.time,
        });
        setIsRefundable(checkRefundability);

        setStatus(data.status);
        setAmount(data.amount);
        setName(data.name);
        setProviderRef(data.providerRef);
        setDate(data.date);
        setTime(data.time);
        setService(data.service);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }

    fecthCheckoutInfo();
  }, [bookingId]);

  async function handleModalVisibility() {
    setModalIsOpen(!modalIsOpen);
  }

  async function cancelBooking() {
    const res = await fetch(`/api/v1/bookings/${bookingId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    console.log(data);
    setStatus(data.status);
    setModalIsOpen(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-300"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center items-center p-4">
      <div className="xl:w-1/3 flex flex-col items-center gap-6 -3 py-6 bg-white p-6 rounded-md shadow-md">
        <div className="flex flex-col justify-center text-center gap-6">
          <p className="text-3xl md:text-4xl font-bold tracking-wide">
            Booking Confirmed!
          </p>
          <div className="tracking-wider max-w-lg mx-auto">
            <p>
              Hi {String(name).split(" ")[0]}, thank you for choosing us! Your
              reservation is confirmed. If there is anything you need before
              your appointment, please don not hesitate to reach us out through
              the email bellow:
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
            Booking Details
          </p>
          <div className="mt-3">
            <div className="flex justify-between mt-1">
              <p className="font-bold">Status</p>
              <p
                className={`tracking-widest ml-3 font-bold
                   ${
                     status === "CONFIRMED" ? "text-green-600" : "text-red-600"
                   }`}
              >
                {status}
              </p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="font-bold">Deposit Paid</p>
              <p className="tracking-wide ml-3">${moneyFormater(amount)}</p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="font-bold">Date</p>
              <p className="tracking-wide ml-3">{date}</p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="font-bold">Time</p>
              <p className="tracking-wide ml-3">{time}</p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="font-bold">Payment Reference Number</p>
              <p className="tracking-wide ml-3 uppercase">{providerRef}</p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="font-bold">Service</p>
              <p className="tracking-wide ml-3">{service}</p>
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

      {modalIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm backdrop-saturate-200" />

          <div className="relative xl:max-w-1/3 z-10 mx-4 text-gray-200 rounded-md border border-white/20 bg-white/20 p-6 shadow-xl text-center fade-in">
            <h2 className="text-xl font-semibold">Booking Cancellation</h2>
            <p className="text-sm mt-1 tracking-wide">
              Please confirm if would like to proceed with your cancellation.
            </p>
            {!isRefundable && (
              <p className="text-sm tracking-wide font-bold">
                Kindly note, cancellations within 24 hours of the appointment
                are not refundable, and the deposit will be forfeited in full.
              </p>
            )}

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
