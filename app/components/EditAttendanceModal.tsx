// src/components/EditAttendanceModal.tsx
import React, {Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {useForm, SubmitHandler} from "react-hook-form";
import {ApiResponse, Attendance, Student} from "../types/types";

interface EditAttendanceFormInputs {
  attendance_id: number;
  status: "Absent" | "Late" | "Present";
}

interface EditAttendanceModalProps {
  isOpen: boolean;
  student: Student;
  setSelectedStudentAttendances: React.Dispatch<
    React.SetStateAction<Attendance[]>
  >;
  onRequestClose: () => void;
  attendance: {
    attendance_id: number;
    status: "Absent" | "Late" | "Present";
  };
  onUpdateAttendance: (updatedAttendance: {
    attendance_id: number;
    status: "Absent" | "Late" | "Present";
  }) => void;
}

const EditAttendanceModal: React.FC<EditAttendanceModalProps> = ({
  isOpen,
  onRequestClose,
  attendance,
  student,
  setSelectedStudentAttendances,
  onUpdateAttendance,
}) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<EditAttendanceFormInputs>({
    defaultValues: {
      attendance_id: attendance.attendance_id,
      status: attendance.status,
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const onSubmit: SubmitHandler<EditAttendanceFormInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://172.20.10.3:3001/api/attendance`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: data.status,
          attendance_id: data.attendance_id,
        }),
      });

      const result = await response.json();
      openAttendanceModal(student);
      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update attendance status."
        );
      }

      onUpdateAttendance(result.result);

      onRequestClose();
    } catch (error: any) {
    } finally {
      setIsSubmitting(false);
    }
  };
  const openAttendanceModal = async (student: Student) => {
    //   console.log(first)
    try {
      const response = await fetch(
        `http://172.20.10.3:3001/api/attendance?student_id=${student.sid}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      const result: ApiResponse<Attendance[][]> = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setSelectedStudentAttendances(result.data.flat());
      } else {
        throw new Error(
          "Failed to fetch attendance records. Please try again."
        );
      }
    } catch (err: any) {
      //   setAttendancesError(err.message || "Failed to fetch attendance records.");
    } finally {
      //   setIsFetchingAttendances(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={isSubmitting ? () => {} : onRequestClose}
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Edit Attendance Status
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Attendance ID (Read-Only) */}
                  <div>
                    <label
                      htmlFor="attendance_id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Attendance ID
                    </label>
                    <input
                      disabled
                      id="attendance_id"
                      type="number"
                      {...register("attendance_id")}
                      readOnly
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      {...register("status", {required: "Status is required"})}
                      className={`mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.status ? "border-red-500" : ""
                      }`}
                    >
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                      <option value="Present">Present</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.status.message}
                      </p>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={onRequestClose}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Loading" : "Update Status"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditAttendanceModal;
