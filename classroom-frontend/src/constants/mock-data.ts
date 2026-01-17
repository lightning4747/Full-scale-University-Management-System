import { Subject } from "@/types";

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

