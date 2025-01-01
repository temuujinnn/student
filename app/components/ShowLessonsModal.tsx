// src/components/ShowLessonsModal.tsx
import React, {Fragment, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {Lesson, GradeUpdateResponse, Student} from "../types/types";
import EditLessonGradeModal from "./EditLessonGradeModal";
import Spinner from "./Spinner";

interface ShowLessonsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  lessons: Lesson[];
  student: Student;
  setSelectedStudentLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
  onGradeUpdated: (updatedLesson: Lesson) => void;
  isLoading: boolean; // New prop
}

const ShowLessonsModal: React.FC<ShowLessonsModalProps> = ({
  isOpen,
  onRequestClose,
  lessons,
  student,
  setSelectedStudentLessons,
  onGradeUpdated,
  isLoading, // Destructure the new prop
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const openEditModal = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedLesson(null);
    setIsEditModalOpen(false);
  };

  const handleGradeUpdated = (updatedGrade: GradeUpdateResponse) => {
    // Find the updated lesson
    const updatedLesson = lessons.find(
      (l) => l.gradeid === updatedGrade.grade_id
    );
    if (updatedLesson) {
      const newLesson: Lesson = {...updatedLesson, grade: updatedGrade.grade};
      onGradeUpdated(newLesson);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={isEditModalOpen ? () => {} : onRequestClose}
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
                    Lessons for {student.firstname} {student.lastname}
                  </Dialog.Title>
                  <div className="mt-2">
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <Spinner />
                      </div>
                    ) : lessons.length > 0 ? (
                      <table className="min-w-full bg-white shadow-md rounded">
                        <thead>
                          <tr>
                            <th className="py-2 px-4 border-b">Course Name</th>
                            <th className="py-2 px-4 border-b">Grade</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lessons.map((lesson) => (
                            <tr
                              key={lesson.gradeid}
                              className="hover:bg-gray-100"
                            >
                              <td className="py-2 px-4 border-b">
                                {lesson.coursename}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {lesson.grade}
                              </td>
                              <td className="py-2 px-4 border-b text-center">
                                <button
                                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                                  onClick={() => openEditModal(lesson)}
                                >
                                  Edit Grade
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No lessons available for this student.</p>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      onClick={onRequestClose}
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

      {/* Edit Lesson Grade Modal */}
      {selectedLesson && (
        <EditLessonGradeModal
          student={student}
          setSelectedStudentLessons={setSelectedStudentLessons}
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          lesson={selectedLesson}
          onGradeUpdated={handleGradeUpdated} // Pass the correct callback
        />
      )}
    </>
  );
};

export default ShowLessonsModal;
