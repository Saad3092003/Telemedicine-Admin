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
    <div className="p-4">
      <h2 className="text-lg font-medium mb-3">Appointment Details</h2>
      {appointment && (
        <div>
          <p className="font-semibold">{appointment.userData.name}</p>
          <p>
            {appointment.slotDate} | {appointment.slotTime}
          </p>
          <p className="mt-2">Symptoms: {appointment.symptoms}</p>
        </div>
      )}

      <div className="mt-4">
        {!inCall && (
          <button
            onClick={startVideo}
            className="px-3 py-2 bg-primary text-white rounded"
          >
            Start Video
          </button>
        )}
        {inCall && (
          <button
            onClick={endCall}
            className="px-3 py-2 bg-red-500 text-white rounded"
          >
            End Call
          </button>
        )}
      </div>

      <div className="mt-4">
        {inCall && appointment && appointment.videoRoomId && (
          <div className="w-full">
            <JitsiMeeting
              domain="meet.jit.si"
              roomName={appointment.videoRoomId}
              configOverwrite={{
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                disableAudioLevels: true,
                prejoinPageEnabled: false,
                disabledNotifications: ["connection_audio_failed"],
              }}
              interfaceConfigOverwrite={{
                SHOW_JITSI_WATERMARK: false,
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
                MOBILE_APP_PROMO: false,
                DEFAULT_WELCOME_PAGE_LOGO_URL: "",
              }}
              userInfo={{
                displayName: "Doctor",
              }}
              getIFrameRef={(iframeRef) => {
                iframeRef.style.height = "480px";
                iframeRef.style.width = "100%";
                iframeRef.style.border = "none";
                iframeRef.style.borderRadius = "0.5rem";
              }}
            />
          </div>
        )}
      </div>

      {prescriptionOpen && (
        <div className="mt-4 border p-3">
          <h3 className="font-semibold mb-2">Fill Prescription</h3>
          <textarea
            placeholder="Medicines (comma separated)"
            value={prescription.medicines.join(",")}
            onChange={(e) =>
              setPrescription((p) => ({
                ...p,
                medicines: e.target.value.split(",").map((s) => s.trim()),
              }))
            }
            className="w-full mb-2 p-2 border"
          />
          <textarea
            placeholder="Notes"
            value={prescription.notes}
            onChange={(e) =>
              setPrescription((p) => ({ ...p, notes: e.target.value }))
            }
            className="w-full mb-2 p-2 border"
          />
          <textarea
            placeholder="Remedies"
            value={prescription.remedies}
            onChange={(e) =>
              setPrescription((p) => ({ ...p, remedies: e.target.value }))
            }
            className="w-full mb-2 p-2 border"
          />
          <div>
            <button
              onClick={submitPrescription}
              className="px-3 py-2 bg-green-600 text-white rounded"
            >
              Submit Prescription
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetail;
