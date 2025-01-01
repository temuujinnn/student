// src/components/EditLessonGradeModal.tsx
import React, {Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {useForm, SubmitHandler} from "react-hook-form";

import {
  GradeUpdateRequest,
  GradeUpdateResponse,
  Lesson,
  ApiResponse,
  Student,
} from "../types/types";

interface EditLessonGradeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  lesson: Lesson;
  student: Student;
  setSelectedStudentLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
  onGradeUpdated: (updatedGrade: GradeUpdateResponse) => void; // Correct callback type
}

const EditLessonGradeModal: React.FC<EditLessonGradeModalProps> = ({
  isOpen,
  onRequestClose,
  lesson,
  setSelectedStudentLessons,
  student,
  onGradeUpdated,
}) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<GradeUpdateRequest>({
    defaultValues: {
      grade_id: lesson.gradeid,
      grade: lesson.grade,
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const onSubmit: SubmitHandler<GradeUpdateRequest> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:3001/api/grade", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<GradeUpdateResponse> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update grade.");
      }

      onGradeUpdated(result.data); // Pass the correct type
      // toast.success("Grade updated successfully!");
      openLessonsModal(student);
      onRequestClose();
    } catch (error: any) {
      // toast.error(`Error: ${error.message || "Failed to update grade."}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const openLessonsModal = async (student: Student) => {
    //localhost:3001/api/grade?student_id=1
    http: try {
      const response = await fetch(
        `http://localhost:3001/api/grade?student_id=${student.sid}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      const result: ApiResponse<Lesson[]> = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setSelectedStudentLessons(result.data.flat());
        console.log(result.data[0]);
      } else {
        throw new Error("Failed to fetch lessons. Please try again.");
      }
    } catch (err: any) {
      // setLessonsError(err.message || "Failed to fetch lessons.");
    } finally {
      // setIsFetchingLessons(false);
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
                  Edit Grade for {lesson.coursename}
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Grade ID (Read-Only) */}
                  <div>
                    <label
                      htmlFor="grade_id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Grade ID
                    </label>
                    <input
                      disabled
                      id="grade_id"
                      type="number"
                      {...register("grade_id")}
                      readOnly
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                    />
                  </div>

                  {/* Grade */}
                  <div>
                    <label
                      htmlFor="grade"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Grade
                    </label>
                    <select
                      id="grade"
                      {...register("grade", {required: "Grade is required"})}
                      className={`mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors.grade ? "border-red-500" : ""
                      }`}
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="F">F</option>
                    </select>
                    {errors.grade && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.grade.message}
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
                      {isSubmitting ? "Loading" : "Update Grade"}
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

export default EditLessonGradeModal;
