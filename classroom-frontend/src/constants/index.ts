export const DEPARTMENTS = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Geography',
    'Economics',
    'Political Science',
    'Sociology',
    'Psychology',
    'Philosophy',
    'Art',
    'Music',
    'Dance',
    'Theater',
    'Film',
    'Literature',
    'Language',
];

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((department)=> (
    {
        value: department,
        label: department.charAt(0).toUpperCase() + department.slice(1),
    }
))
