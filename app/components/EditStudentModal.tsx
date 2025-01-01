// src/components/EditStudentModal.tsx
import React, {Fragment, useEffect} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {useForm, SubmitHandler} from "react-hook-form";
import {ApiResponse, Student} from "../types/types";

interface EditStudentFormInputs {
  student_id: number; // Including SID in the form
  first_name: string;
  last_name: string;
  phone: string;
}

interface EditStudentModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onUpdateStudent: (student: Student) => void;
  student: Student;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  onRequestClose,
  onUpdateStudent,
  setStudents,
  student,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<EditStudentFormInputs>({
    defaultValues: {
      student_id: student.sid,
      first_name: student.firstname,
      last_name: student.lastname,
      phone: student.phone,
    },
  });
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<EditStudentFormInputs> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("http://172.20.10.3:3001/api/student", {
        method: "PUT", // Using PUT method as per your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Sending SID and updated fields in the body
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      const result: ApiResponse<Student> = await response.json();

      if (result.success && result.data) {
        onUpdateStudent(result.data);
        fetchStudents();
        reset();
        onRequestClose();
      } else {
        throw new Error("Failed to update student. Please try again.");
      }
    } catch (err: any) {
      setSubmitError(err.message || "Failed to update student.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const fetchStudents = async () => {
    try {
      const response = await fetch("http://172.20.10.3:3001/api/students");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result: ApiResponse<Student[][]> = await response.json();

      if (result.success && Array.isArray(result.data)) {
        // Flatten the nested array
        const fetchedStudents: Student[] = result.data.flat();
        setStudents(fetchedStudents);
      } else {
        throw new Error("Invalid data format received from API.");
      }
    } catch (err: any) {
      //   setError(err.message || "Failed to fetch student data.");
    } finally {
      //   setLoading(false);
    }
  };

  // Reset form when student changes
  useEffect(() => {
    reset({
      student_id: student.sid,
      first_name: student.firstname,
      last_name: student.lastname,
      phone: student.phone,
    });
  }, [student, reset]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onRequestClose}>
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
                  Edit Student
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* SID Field (Read-Only) */}
                  <div>
                    <label
                      htmlFor="sid"
                      className="block text-sm font-medium text-gray-700"
                    >
                      SID
                    </label>
                    <input
                      disabled
                      id="sid"
                      type="number"
                      {...register("student_id")}
                      readOnly
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                    />
                  </div>

                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstname"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      id="firstname"
                      type="text"
                      {...register("first_name", {
                        required: "First name is required",
                      })}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.first_name ? "border-red-500" : ""
                      }`}
                    />
                    {errors.first_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="lastname"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastname"
                      type="text"
                      {...register("last_name", {
                        required: "Last name is required",
                      })}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.last_name ? "border-red-500" : ""
                      }`}
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="text"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{7,15}$/,
                          message: "Enter a valid phone number (7-15 digits)",
                        },
                      })}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Error */}
                  {submitError && (
                    <div className="text-red-500 text-sm">
                      Error: {submitError}
                    </div>
                  )}

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
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Update Student"}
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

export default EditStudentModal;
