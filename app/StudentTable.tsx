// src/StudentTable.tsx
"use client";
import React, {useState, useEffect} from "react";
import dynamic from "next/dynamic";
import {ApiResponse, Student, Lesson, Attendance} from "./types/types";
import ShowAttendanceModal from "./components/ShowAttendanceModal";
import {FaEdit, FaPlus, FaList, FaCalendarCheck} from "react-icons/fa";

const AddStudentModal = dynamic(() => import("./components/AddStudentModal"), {
  ssr: false,
});
const EditStudentModal = dynamic(
  () => import("./components/EditStudentModal"),
  {
    ssr: false,
  }
);
const ShowLessonsModal = dynamic(
  () => import("./components/ShowLessonsModal"),
  {
    ssr: false,
  }
);

const StudentTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLessonsModalOpen, setIsLessonsModalOpen] = useState<boolean>(false);
  const [selectedStudentLessons, setSelectedStudentLessons] = useState<
    Lesson[]
  >([]);
  const [selectedStudentAttendances, setSelectedStudentAttendances] = useState<
    Attendance[]
  >([]);

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] =
    useState<boolean>(false);
  const [isFetchingAttendances, setIsFetchingAttendances] =
    useState<boolean>(false);
  const [attendancesError, setAttendancesError] = useState<string | null>(null);
  const [isFetchingLessons, setIsFetchingLessons] = useState<boolean>(false);
  const [lessonsError, setLessonsError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/students");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result: ApiResponse<Student[][]> = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const fetchedStudents: Student[] = result.data.flat();
          setStudents(fetchedStudents);
          setFilteredStudents(fetchedStudents);
        } else {
          throw new Error("Invalid data format received from API.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch student data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = students.filter(
        (student) =>
          student.firstname.toLowerCase().includes(lowerCaseQuery) ||
          student.lastname.toLowerCase().includes(lowerCaseQuery) ||
          student.sid.toString().includes(lowerCaseQuery)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedStudent(null);
    setIsEditModalOpen(false);
  };

  const openAttendanceModal = async (student: Student) => {
    setSelectedStudent(student);
    setIsFetchingAttendances(true);
    setAttendancesError(null);
    setIsAttendanceModalOpen(true);

    try {
      const response = await fetch(
        `http://localhost:3001/api/attendance?student_id=${student.sid}`
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
      setAttendancesError(err.message || "Failed to fetch attendance records.");
    } finally {
      setIsFetchingAttendances(false);
    }
  };

  const closeAttendanceModal = () => {
    setIsAttendanceModalOpen(false);
    setSelectedStudent(null);
    setSelectedStudentAttendances([]);
  };

  const openLessonsModal = async (student: Student) => {
    setSelectedStudent(student);
    setIsFetchingLessons(true);
    setLessonsError(null);
    setIsLessonsModalOpen(true);

    try {
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
      } else {
        throw new Error("Failed to fetch lessons. Please try again.");
      }
    } catch (err: any) {
      setLessonsError(err.message || "Failed to fetch lessons.");
    } finally {
      setIsFetchingLessons(false);
    }
  };

  const closeLessonsModal = () => {
    setIsLessonsModalOpen(false);
    setSelectedStudent(null);
    setSelectedStudentLessons([]);
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents((prevStudents) => [...prevStudents, newStudent]);
    setFilteredStudents((prevStudents) => [...prevStudents, newStudent]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.sid === updatedStudent.sid ? updatedStudent : student
      )
    );
    setFilteredStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.sid === updatedStudent.sid ? updatedStudent : student
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading spinner"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold mb-4 md:mb-0">Student List</h2>
        <button
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={openAddModal}
        >
          <FaPlus className="mr-2" />
          Add Student
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by SID, First or Last Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Search students"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr>
              <th className="py-3 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                SID
              </th>
              <th className="py-3 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                First Name
              </th>
              <th className="py-3 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                Last Name
              </th>
              <th className="py-3 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700 hidden sm:table-cell">
                Phone
              </th>
              <th className="py-3 px-4 bg-gray-200 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student: Student, index: number) => (
                <tr
                  key={student.sid}
                  className={`hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4 border-b text-sm text-gray-700">
                    {student.sid}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">
                    {student.firstname}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">
                    {student.lastname}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700 hidden sm:table-cell">
                    {student.phone}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      {/* Edit Button */}
                      <button
                        className="flex items-center border border-indigo-500 text-indigo-500 px-3 py-1 rounded hover:bg-indigo-500 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        onClick={() => openEditModal(student)}
                        aria-label={`Edit student ${student.firstname} ${student.lastname}`}
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </button>

                      {/* Lessons Button */}
                      <button
                        className="flex items-center border border-teal-500 text-teal-500 px-3 py-1 rounded hover:bg-teal-500 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-teal-400"
                        onClick={() => openLessonsModal(student)}
                        aria-label={`Show lessons for ${student.firstname} ${student.lastname}`}
                      >
                        <FaList className="mr-1" />
                        Lessons
                      </button>

                      {/* Attendance Button */}
                      <button
                        className="flex items-center border border-yellow-500 text-yellow-500 px-3 py-1 rounded hover:bg-yellow-500 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        onClick={() => openAttendanceModal(student)}
                        aria-label={`Show attendance for ${student.firstname} ${student.lastname}`}
                      >
                        <FaCalendarCheck className="mr-1" />
                        Attendance
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        setStudents={setStudents}
        onRequestClose={closeAddModal}
        onAddStudent={handleAddStudent}
      />

      {/* Edit Student Modal */}
      {selectedStudent && (
        <EditStudentModal
          setStudents={setStudents}
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          onUpdateStudent={handleUpdateStudent}
          student={selectedStudent}
        />
      )}

      {/* Show Lessons Modal */}
      {selectedStudent && (
        <ShowLessonsModal
          isOpen={isLessonsModalOpen}
          onRequestClose={closeLessonsModal}
          student={selectedStudent}
          lessons={selectedStudentLessons}
          setSelectedStudentLessons={setSelectedStudentLessons}
          onGradeUpdated={function (updatedLesson: Lesson): void {
            // Implement grade update logic here
          }}
          isLoading={isFetchingLessons}
        />
      )}

      {/* Show Attendance Modal */}
      {selectedStudent && (
        <ShowAttendanceModal
          isOpen={isAttendanceModalOpen}
          onRequestClose={closeAttendanceModal}
          attendances={selectedStudentAttendances}
          student={selectedStudent}
          setSelectedStudentAttendances={setSelectedStudentAttendances}
          isLoading={isFetchingAttendances}
          error={attendancesError}
        />
      )}
    </div>
  );
};

export default StudentTable;
