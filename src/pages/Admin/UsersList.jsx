import React, { useEffect } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllAppointments = () => {
  const { aToken, users, getAllUsers } = useContext(AdminContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllUsers();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5 ">
      <p className="mb-3 text-lg font-medium">All Users</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Name</p>
          <p>Email</p>
          <p>Phone</p>
          <p>Dob</p>
          <p>Gender</p>
          {/* <p>Action</p> */}
        </div>
        {users.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <p>{item.name}</p>
            <p>{item.email}</p>
            <p>{item.phone}</p>
            <p>{calculateAge(item.dob)}</p>
            <p>{item.gender}</p>
            {/* <p>--</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
