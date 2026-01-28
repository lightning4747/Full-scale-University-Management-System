import { Subject, User, UserRole } from "@/types";

export const MOCK_TEACHERS: User[] = [
  {
    id: "teacher-1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: UserRole.TEACHER,
    department: "Computer Science",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "teacher-2",
    name: "Prof. Michael Chen",
    email: "michael.chen@university.edu",
    role: UserRole.TEACHER,
    department: "Mathematics",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "teacher-3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@university.edu",
    role: UserRole.TEACHER,
    department: "Physics",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "teacher-4",
    name: "Prof. David Kim",
    email: "david.kim@university.edu",
    role: UserRole.TEACHER,
    department: "Chemistry",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "teacher-5",
    name: "Dr. Amanda Foster",
    email: "amanda.foster@university.edu",
    role: UserRole.TEACHER,
    department: "Biology",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    description: "An introductory course covering fundamental concepts of computer science including programming basics, algorithms, and data structures.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    code: "MATH201",
    name: "Calculus II",
    department: "Mathematics",
    description: "Advanced calculus topics including integration techniques, sequences, series, and applications of calculus in engineering and science.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    code: "PHYS301",
    name: "Quantum Mechanics",
    department: "Physics",
    description: "Study of quantum theory, wave-particle duality, Schrödinger equation, and quantum systems with applications to modern physics.",
    createdAt: new Date().toISOString(),
  },
];

