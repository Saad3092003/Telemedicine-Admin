import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    speciality: "General physician",
    degree: "",
    password: "",
    confirmPassword: "",
    address: "",
    experience: "1 Year",
    fees: "",
    about: "",
    mbbsCertificate: null,
    registrationCertificate: null,
  });
  const [docImg, setDocImg] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!docImg) {
      return toast.error("Image Not Selected");
    }

    // 1. Password validation (fail fast)
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    // 2. Build FormData for multipart request
    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("speciality", formData.speciality);
    data.append("degree", formData.degree);
    data.append("password", formData.password);
    data.append("experience", formData.experience);
    data.append("fees", formData.fees);
    data.append("about", formData.about);

    // backend expects address as JSON
    data.append("address", JSON.stringify(formData.address));

    // KYC files
    data.append("mbbsCertificate", formData.mbbsCertificate);
    data.append("registrationCertificate", formData.registrationCertificate);

    data.append("profileFile", docImg);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/doctor/signup`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        toast.success("Signup successful. KYC under review.");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center py-8"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-[700px] border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">Doctor</span> Sign Up
        </p>

        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            name=""
            id="doc-img"
            hidden
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>
        {/* Name */}
        <div className="flex flex-col md:flex-row gap-3 w-full">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          {/* Email */}
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full">
          {/* Phone */}
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          {/* Degree */}
          <Input
            label="Degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
          />
        </div>
        {/* Speciality */}
        <div className="w-full">
          <p>Speciality</p>
          <select
            name="speciality"
            value={formData.speciality}
            onChange={handleChange}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            required
          >
            <option value="General physician">General physician</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatricians">Pediatricians</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Gastroenterologist">Gastroenterologist</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full">
          {/* Password */}
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          {/* Confirm Password */}
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div className="w-full">
          <p>Address</p>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border border-[#DADADA] rounded w-full p-2 mt-1 resize-none"
            rows="3"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full">
          {/* Experience */}
          <div className="w-full">
            <p>Experience</p>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              required
            >
              <option value="1 Year">1 Year</option>
              <option value="2 Year">2 Years</option>
              <option value="3 Year">3 Years</option>
              <option value="4 Year">4 Years</option>
              <option value="5 Year">5 Years</option>
              <option value="6 Year">6 Years</option>
              <option value="8 Year">8 Years</option>
              <option value="9 Year">9 Years</option>
              <option value="10 Year">10 Years</option>
            </select>
          </div>

          {/* Fees */}
          <Input
            label="Consultation Fees"
            name="fees"
            value={formData.fees}
            onChange={handleChange}
          />
        </div>

        {/* About */}
        <div className="w-full">
          <p>About Yourself</p>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            className="border border-[#DADADA] rounded w-full p-2 mt-1 resize-none"
            rows="3"
            required
          />
        </div>

        {/* MBBS Certificate */}
        <FileInput
          label="MBBS Degree / Passing Certificate"
          name="mbbsCertificate"
          onChange={handleChange}
        />

        {/* Registration Certificate */}
        <FileInput
          label="State Medical Council / NMC Registration Certificate"
          name="registrationCertificate"
          onChange={handleChange}
        />

        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          Register
        </button>
      </div>
    </form>
  );
};

export default DoctorSignup;

// Reusable Components
const Input = ({ label, type = "text", ...props }) => (
  <div className="w-full">
    <p>{label}</p>
    <input
      type={type}
      className="border border-[#DADADA] rounded w-full p-2 mt-1"
      required
      {...props}
    />
  </div>
);

const FileInput = ({ label, ...props }) => (
  <div className="w-full">
    <p>{label}</p>
    <input
      type="file"
      className="border border-[#DADADA] rounded w-full p-2 mt-1"
      required
      {...props}
    />
  </div>
);
