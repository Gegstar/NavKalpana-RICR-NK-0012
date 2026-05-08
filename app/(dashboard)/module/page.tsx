export default function CoursePage() {
  const modules = [
    {
      id: 1,
      title: "Java Basics",
      lessons: ["Variables", "Functions", "Loops"],
    },
    {
      id: 2,
      title: "Spring Boot",
      lessons: ["Controllers", "Services", "Repositories"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Course Modules</h1>
        <p className="text-gray-600 mb-8">Simple course page template</p>

        <div className="space-y-4">
          {modules.map((module) => (
            <div key={module.id} className="bg-white rounded-2xl shadow p-5">
              <h2 className="text-xl font-semibold mb-3">{module.title}</h2>

              <ul className="space-y-2">
                {module.lessons.map((lesson, index) => (
                  <li
                    key={index}
                    className="border rounded-xl px-3 py-2 text-sm"
                  >
                    {lesson}
                  </li>
                ))}
              </ul>

              <button className="mt-4 px-4 py-2 rounded-xl border text-sm">
                Add Lesson
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}