import { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";
import { JitsiMeeting } from "@jitsi/react-sdk";

const AppointmentDetail = () => {
  const { id } = useParams();
  const { backendUrl, dToken } = useContext(DoctorContext);

  const [appointment, setAppointment] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [prescriptionOpen, setPrescriptionOpen] = useState(false);
  const [prescription, setPrescription] = useState({
    medicines: [],
    notes: "",
    remedies: "",
  });

  const getAppointment = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/appointment",
        { appointmentId: id },
        { headers: { dToken } },
      );
      if (data.success) setAppointment(data.appointment);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (dToken) getAppointment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dToken, id]);

  const startVideo = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/start-video",
        { appointmentId: id },
        { headers: { dToken } },
      );
      if (!data.success) return toast.error(data.message);
      setInCall(true);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const endCall = () => {
    setInCall(false);
    setPrescriptionOpen(true);
  };

  const submitPrescription = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/save-prescription",
        { appointmentId: id, prescription },
        { headers: { dToken } },
      );
      if (data.success) {
        toast.success("Prescription saved");
        setPrescriptionOpen(false);
        getAppointment();
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ width: "100%" }}>
      <div className="w-100 space-y-6">
        {/* HEADER CARD */}
        <div className="bg-white  rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>

          {appointment && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">
                  {appointment.userData.name}
                </p>
                <p className="text-sm text-gray-500">
                  {appointment.slotDate} • {appointment.slotTime}
                </p>
                <p className="mt-2 text-sm">
                  <span className="font-medium">Symptoms:</span>{" "}
                  {appointment.symptoms || "—"}
                </p>
              </div>

              {/* STATUS BADGE */}
              <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                Consultation
              </span>
            </div>
          )}
        </div>

        {/* ACTION BAR */}
        {appointment && appointment.videoStatus != "completed" && (
          <div className="bg-white rounded-xl shadow p-4  justify-between items-center">
            <p className="font-medium mb-3">Video Consultation</p>

            {!inCall ? (
              <button
                onClick={startVideo}
                className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
              >
                Start Video Call
              </button>
            ) : (
              <button
                onClick={endCall}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                End Call
              </button>
            )}
          </div>
        )}

        {/* VIDEO AREA */}
        {inCall && appointment?.videoRoomId && (
          <div className="bg-black rounded-xl overflow-hidden shadow">
            <JitsiMeeting
              domain="meet.jit.si"
              roomName={appointment.videoRoomId}
              configOverwrite={{
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                prejoinPageEnabled: false,
              }}
              interfaceConfigOverwrite={{
                SHOW_JITSI_WATERMARK: false,
                MOBILE_APP_PROMO: false,
              }}
              userInfo={{ displayName: "Doctor" }}
              getIFrameRef={(iframeRef) => {
                iframeRef.style.height = "500px";
                iframeRef.style.width = "100%";
                iframeRef.style.border = "none";
              }}
            />
          </div>
        )}

        {/* PRESCRIPTION / CONSULTATION FORM */}
        {prescriptionOpen && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              Post-Consultation Notes
            </h3>

            <div className="space-y-4">
              {/* MEDICINES */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Medicines
                </label>
                <textarea
                  placeholder="Paracetamol 500mg, Vitamin C, ..."
                  value={prescription.medicines.join(",")}
                  onChange={(e) =>
                    setPrescription((p) => ({
                      ...p,
                      medicines: e.target.value.split(",").map((s) => s.trim()),
                    }))
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  rows={2}
                />
              </div>

              {/* REMEDIES */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Remedies / Advice
                </label>
                <textarea
                  placeholder="Rest well, stay hydrated, avoid cold drinks…"
                  value={prescription.remedies}
                  onChange={(e) =>
                    setPrescription((p) => ({
                      ...p,
                      remedies: e.target.value,
                    }))
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  rows={3}
                />
              </div>

              {/* NOTES */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Doctor Notes
                </label>
                <textarea
                  placeholder="Additional observations…"
                  value={prescription.notes}
                  onChange={(e) =>
                    setPrescription((p) => ({
                      ...p,
                      notes: e.target.value,
                    }))
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  rows={3}
                />
              </div>

              {/* SUBMIT */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={submitPrescription}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save Consultation
                </button>
              </div>
            </div>
          </div>
        )}

        {appointment?.videoStatus === "completed" &&
          appointment?.prescription && (
            <div className="bg-white rounded-xl shadow p-6 space-y-5">
              {/* HEADER */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Consultation Record</h3>
                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  Finalized
                </span>
              </div>

              {/* META */}
              <p className="text-sm text-gray-500">
                Submitted on{" "}
                {new Date(
                  appointment.prescription.prescribedAt,
                ).toLocaleString()}
              </p>

              {/* MEDICINES */}
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Prescribed Medicines
                </h4>
                <div className="border rounded-lg p-3 bg-gray-50">
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                    {appointment.prescription.medicines.map((med, idx) => (
                      <li key={idx}>{med}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* REMEDIES */}
              <div>
                <h4 className="text-sm font-medium mb-1">
                  Remedies / Advice Given
                </h4>
                <div className="border rounded-lg p-3 bg-gray-50 text-sm text-gray-800">
                  {appointment.prescription.remedies || "—"}
                </div>
              </div>

              {/* NOTES */}
              <div>
                <h4 className="text-sm font-medium mb-1">
                  Doctor Notes (Internal)
                </h4>
                <div className="border rounded-lg p-3 bg-gray-50 text-sm text-gray-800">
                  {appointment.prescription.notes || "—"}
                </div>
              </div>

              {/* FOOTER */}
              <div className="pt-3 border-t text-sm text-gray-500">
                This consultation record is locked and cannot be edited.
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default AppointmentDetail;
