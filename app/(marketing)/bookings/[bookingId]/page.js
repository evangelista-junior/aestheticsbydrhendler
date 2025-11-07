"use client";

import { useEffect, useState, use } from "react";
import moneyFormater from "@/lib/utils/moneyFormater";
import Button from "@/components/Button";
import { Check, X } from "lucide-react";
import { useParams } from "next/navigation";
import { checkIsRefundable } from "@/lib/business/booking/cancellation";
import { useLoadingModal } from "@/store/useLoadingModal";
import { apiRequest } from "@/lib/server/useApi";
import Headings from "@/components/Headings";

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
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { setLoading } = useLoadingModal();

  useEffect(() => {
    async function fecthCheckoutInfo() {
      try {
        setLoading(true);
        const res = await apiRequest(`/api/v1/bookings/${bookingId}`);
        if (res.ok == false) {
          throw new Error(res.message);
        }

        const checkRefundability = checkIsRefundable({
          bookingDate: res.date,
          bookingTime: res.time,
        });
        setIsRefundable(checkRefundability);

        setStatus(res.status);
        setAmount(res.amount);
        setName(res.name);
        setProviderRef(res.providerRef);
        setDate(res.date);
        setTime(res.time);
        setService(res.service);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }

    fecthCheckoutInfo();
  }, [bookingId, setLoading]);

  async function handleModalVisibility() {
    setModalIsOpen(!modalIsOpen);
  }

  async function cancelBooking() {
    try {
      setLoading(true);
      setModalIsOpen(false);
      const res = await apiRequest(`/api/v1/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (res.ok == false) throw new Error(res.message);

      setStatus(res.status);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full flex flex-col justify-center items-center p-4">
      <div className="w-full flex flex-col items-center gap-6 p-6 py-9 shadow">
        <div className="flex flex-col justify-center text-center gap-6">
          <Headings headingType="h3" className="uppercase font-title">
            Booking Confirmed
          </Headings>
          <div className="uppercase text-xs tracking-wider max-w-lg mx-auto">
            <p>
              Hi {String(name).split(" ")[0]}, thank you for choosing us! Your
              reservation is confirmed. If there is anything you need before
              your appointment, please don not hesitate to reach us out through
              the email bellow:
            </p>
            <a
              href="mailto:info@aestheticsbydrhendler.com.au"
              className="cursor-pointer text-primary hover:text-primary transition-all duration-300"
            >
              info@aestheticsbydrhendler.com.au
            </a>
          </div>
        </div>

        <div className="sm:min-w-lg">
          <p className="text-xl uppercase tracking-wider text-center">
            Booking Details
          </p>
          <div className="mt-3">
            <div className="flex justify-between mt-1">
              <p className="uppercase">Status</p>
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
              <p className="uppercase">Deposit Paid</p>
              <p className="text-xs tracking-wide ml-3">
                ${moneyFormater(amount)}
              </p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="uppercase">Date</p>
              <p className="text-xs tracking-wide ml-3">{date}</p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="uppercase">Time</p>
              <p className="text-xs tracking-wide ml-3">{time}</p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="uppercase">Payment Reference Number</p>
              <p className="text-xs tracking-wide ml-3 uppercase">
                {providerRef}
              </p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="uppercase">Service</p>
              <p className="text-xs tracking-wide ml-3">{service}</p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="uppercase">Address</p>
              <address className="text-xs tracking-wide ml-3">
                North Bondi, 2026, Sydney NSW
              </address>
            </div>
          </div>

          <div className="mt-12 text-center uppercase text-xs">
            <p className="font-bold">Cancellation Policy</p>
            <p>
              Appointments cancelled within 24 hours will forfeit the full
              deposit. <br />
              To cancel your appointment, please{" "}
              <button
                onClick={handleModalVisibility}
                className="text-primary/30 uppercase underline tracking-wide cursor-pointer"
              >
                click here
              </button>{" "}
              or email us at{" "}
              <a
                href="mailto:info@aestheticsbydrhendler.com.au"
                className="text-primary/30 underline tracking-wide"
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

          <div className="relative xl:max-w-1/3 z-10 mx-4 text-gray-200 border border-white/20 bg-white/20 p-6 shadow-xl text-center fade-in">
            <h2 className="text-xl font-semibold uppercase">
              Booking Cancellation
            </h2>
            <p className="text-sm mt-1 tracking-wide uppercase">
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
