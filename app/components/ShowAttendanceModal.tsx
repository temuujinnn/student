// src/components/ShowAttendanceModal.tsx
import React, {Fragment, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {Attendance, Student} from "../types/types";
import EditAttendanceModal from "./EditAttendanceModal";

interface ShowAttendanceModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  attendances: Attendance[];
  isLoading: boolean;
  error: string | null;
  setSelectedStudentAttendances: React.Dispatch<
    React.SetStateAction<Attendance[]>
  >;
  student: Student;
}

const ShowAttendanceModal: React.FC<ShowAttendanceModalProps> = ({
  isOpen,
  onRequestClose,
  attendances,
  setSelectedStudentAttendances,
  isLoading,
  student,
  error,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);

  const openEditModal = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedAttendance(null);
    setIsEditModalOpen(false);
  };

  const handleUpdateAttendance = (updatedAttendance: {
    attendance_id: number;
    status: "Absent" | "Late" | "Present";
  }) => {
    // You should implement a way to update the attendance in the parent component or fetch again
    // For simplicity, this is handled in the parent component (StudentTable.tsx)
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={isLoading ? () => {} : onRequestClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-50"
            leave="ease-in duration-200"
            leaveFrom="opacity-50"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900 mb-4"
                  >
                    Attendance Records
                  </Dialog.Title>
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : attendances.length > 0 ? (
                    <table className="min-w-full bg-white shadow-md rounded">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b">Date</th>
                          <th className="py-2 px-4 border-b">Status</th>
                          <th className="py-2 px-4 border-b">Course Name</th>
                          <th className="py-2 px-4 border-b">Weekday</th>
                          <th className="py-2 px-4 border-b">Room Number</th>
                          <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendances.map((attendance) => (
                          <tr
                            key={attendance.attendanceid}
                            className="hover:bg-gray-100"
                          >
                            <td className="py-2 px-4 border-b">
                              {new Date(
                                attendance.attendancedate
                              ).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {attendance.status}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {attendance.coursename}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {attendance.weekday}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {attendance.roomnumber}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              <button
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                                onClick={() => openEditModal(attendance)}
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No attendance records available for this student.</p>
                  )}

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      onClick={onRequestClose}
                      disabled={isLoading}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Attendance Modal */}
      {selectedAttendance && (
        <EditAttendanceModal
          student={student}
          setSelectedStudentAttendances={setSelectedStudentAttendances}
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          attendance={{
            attendance_id: selectedAttendance.attendanceid,
            status: selectedAttendance.status as "Absent" | "Late" | "Present",
          }}
          onUpdateAttendance={handleUpdateAttendance}
        />
      )}
    </>
  );
};

export default ShowAttendanceModal;
