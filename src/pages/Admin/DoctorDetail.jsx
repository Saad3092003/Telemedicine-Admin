import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const DoctorDetail = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get("id");

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchDoctor = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/doctor/${doctorId}`,
        { headers: { aToken: localStorage.getItem("aToken") } },
      );
      if (data.success) setDoctor(data.doctor);
      else toast.error(data.message);
    } catch {
      toast.error("Failed to load doctor");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/doctor/kyc-status`,
        { doctorId, status },
      );
      if (data.success) {
        toast.success(`Doctor ${status}`);
        fetchDoctor();
      } else toast.error(data.message);
    } catch {
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  if (loading) return <FullCenter text="Loading doctor profile…" />;
  if (!doctor) return <FullCenter text="Doctor not found" />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT – PROFILE CARD */}
        <div className="bg-white rounded-xl shadow p-6">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-40 h-40 rounded-full mx-auto object-cover border"
          />
          <h2 className="text-xl font-semibold text-center mt-4">
            {doctor.name}
          </h2>
          <p className="text-center text-gray-500">{doctor.speciality}</p>

          <div className="mt-6 space-y-2 text-sm">
            <Info label="Email" value={doctor.email} />
            <Info label="Phone" value={doctor.phone} />
            <Info label="Degree" value={doctor.degree} />
            <Info label="Experience" value={`${doctor.experience} yrs`} />
            <Info label="Fees" value={`₹${doctor.fees}`} />
            <Info label="Status" value={doctor?.status} highlight />
          </div>
        </div>

        {/* RIGHT – DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          {/* ABOUT */}
          <Card title="About Doctor">
            <p className="text-sm text-gray-600">{doctor.about}</p>
          </Card>

          {/* ADDRESS */}
          <Card title="Address">
            <p className="text-sm text-gray-600">
              {doctor.address?.line1}, {doctor.address?.city},{" "}
              {doctor.address?.state} – {doctor.address?.pincode}
            </p>
          </Card>

          {/* KYC DOCUMENTS */}
          <Card title="KYC Documents">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DocImage
                title="MBBS Certificate"
                src={doctor?.mbbsCertificate}
              />
              <DocImage
                title="Registration Certificate"
                src={doctor?.registrationCertificate}
              />
            </div>
          </Card>

          {/* ACTION BAR */}
          {doctor?.status === "pending" && (
            <div className="sticky bottom-4 bg-yellow-100 border flex  justify-between gap-4 rounded-xl shadow p-4 ">
              <p className="text-gray-600 mt-2">Waiting for approval</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => updateStatus("rejected")}
                  className="px-6 py-2 rounded-md bg-red-600 text-white"
                >
                  Reject
                </button>
                <button
                  onClick={() => updateStatus("approved")}
                  className="px-6 py-2 rounded-md bg-green-600 text-white"
                >
                  Approve
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;

/* ---------- UI Primitives ---------- */

const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

const Info = ({ label, value, highlight }) => (
  <p className="flex justify-between">
    <span className="font-medium">{label}</span>
    <span
      className={`${
        highlight ? "font-semibold text-primary" : "text-gray-600"
      }`}
    >
      {value}
    </span>
  </p>
);

const DocImage = ({ title, src }) => (
  <div>
    <p className="text-sm font-medium mb-1">{title}</p>
    <a href={src} target="_blank" rel="noreferrer">
      <img
        src={src}
        alt={title}
        className="w-full h-56 object-contain border rounded-lg bg-gray-100 hover:scale-[1.01] transition"
      />
    </a>
  </div>
);

const FullCenter = ({ text }) => (
  <div className="min-h-screen flex items-center justify-center text-gray-500">
    {text}
  </div>
);
