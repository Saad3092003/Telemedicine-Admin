import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } =
    useContext(AdminContext);
  const { slotDateFormat, currency } = useContext(AppContext);
  const [showCanvas, setShowCanvas] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const openOffcanvas = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCanvas(true);
  };

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5 ">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                src={item.userData.image}
                className="w-8 rounded-full"
                alt=""
              />{" "}
              <p>{item.userData.name}</p>
            </div>
            <p className="max-sm:hidden">{item.payment ? "Paid" : "Unpaid"}</p>
            <p
              onClick={() => openOffcanvas(item)}
              className="cursor-pointer text-primary hover:underline"
            >
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>

            <div className="flex items-center gap-2">
              <img
                src={item.docData.image}
                className="w-8 rounded-full bg-gray-200"
                alt=""
              />{" "}
              <p>{item.docData.name}</p>
            </div>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-xs font-medium">Completed</p>
            ) : (
              <img
                onClick={() => cancelAppointment(item._id)}
                className="w-10 cursor-pointer"
                src={assets.cancel_icon}
                alt=""
              />
            )}
          </div>
        ))}
      </div>
      {showCanvas && (
        <AppointmentOffcanvas
          appointment={selectedAppointment}
          onClose={() => setShowCanvas(false)}
          currency={currency}
          slotDateFormat={slotDateFormat}
        />
      )}
    </div>
  );
};

const AppointmentOffcanvas = ({
  appointment,
  onClose,
  currency,
  slotDateFormat,
}) => {
  const {
    slotDate,
    slotTime,
    symptoms,
    purpose,
    amount,
    payment,
    userData,
    docData,
  } = appointment;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Appointment Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-5 text-sm">
          {/* DATE */}
          <Section title="Schedule">
            <Info
              label="Appointment Date"
              value={`${slotDateFormat(slotDate)}, ${slotTime}`}
            />
          </Section>

          {/* PATIENT */}
          <Section title="Patient">
            <ProfileRow image={userData.image} name={userData.name} />
            <Info label="Email" value={userData.email} />
            <Info label="Phone" value={userData.phone} />
            <Info label="Gender" value={userData.gender} />
            <Info label="DOB" value={userData.dob} />
          </Section>

          {/* DOCTOR */}
          <Section title="Doctor">
            <ProfileRow image={docData.image} name={docData.name} />
            <Info label="Speciality" value={docData.speciality} />
            <Info label="Degree" value={docData.degree} />
            <Info label="Experience" value={docData.experience} />
          </Section>

          {/* MEDICAL */}
          <Section title="Medical Info">
            <Info label="Symptoms" value={symptoms || "—"} />
            <Info label="Purpose" value={purpose || "—"} />
          </Section>

          {/* PAYMENT */}
          <Section title="Payment">
            <Info label="Amount" value={`${currency}${amount}`} />
            <Info
              label="Status"
              value={payment ? "Paid" : "Unpaid"}
              highlight
            />
          </Section>
        </div>
      </div>
    </>
  );
};

const Section = ({ title, children }) => (
  <div className="border rounded-lg p-3">
    <p className="font-medium mb-2">{title}</p>
    <div className="space-y-1">{children}</div>
  </div>
);

const Info = ({ label, value, highlight }) => (
  <p className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className={highlight ? "font-semibold text-primary" : ""}>
      {value}
    </span>
  </p>
);

const ProfileRow = ({ image, name }) => (
  <div className="flex items-center gap-3 mb-2">
    <img
      src={image}
      alt=""
      className="w-10 h-10 rounded-full object-cover bg-gray-200"
    />
    <p className="font-medium">{name}</p>
  </div>
);

export default AllAppointments;
