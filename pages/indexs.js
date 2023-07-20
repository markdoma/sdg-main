import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to Ligaya SDG</h1>
      <Link href="/attendancepage">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded">
          Attendance
        </button>
      </Link>
    </div>
  );
};

export default HomePage;
