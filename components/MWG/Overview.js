import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default function Overview({ members }) {
  // Function to calculate age from birthday
  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Define age ranges
  const ageRanges = [
    "0-10",
    "11-20",
    "21-30",
    "31-40",
    "41-50",
    "51-60",
    "61+",
  ];

  const ageCounts = ageRanges.reduce((acc, range) => {
    acc[range] = 0;
    return acc;
  }, {});

  // Function to determine which age range an age falls into
  const getAgeRange = (age) => {
    if (age <= 10) return "0-10";
    if (age <= 20) return "11-20";
    if (age <= 30) return "21-30";
    if (age <= 40) return "31-40";
    if (age <= 50) return "41-50";
    if (age <= 60) return "51-60";
    return "61+";
  };

  // Populate ageCounts based on member ages
  members.forEach((member) => {
    if (member.birthdate) {
      const age = calculateAge(member.birthdate);
      const range = getAgeRange(age);
      ageCounts[range] = (ageCounts[range] || 0) + 1;
    }
  });
  console.log(members);
  if (!Array.isArray(members)) {
    console.error("Expected data to be an array");
    return <p>Error: Invalid data format</p>;
  }
  // Process the data to count occurrences of each gender
  const genderCounts = members.reduce((acc, member) => {
    if (member.gender) {
      acc[member.gender] = (acc[member.gender] || 0) + 1;
    }
    return acc;
  }, {});

  // Process the data to count occurrences of each gender
  const ligayaClassCounts = members.reduce((acc, member) => {
    if (member.ligaya_class) {
      acc[member.ligaya_class] = (acc[member.ligaya_class] || 0) + 1;
    }
    return acc;
  }, {});

  const ageChartData = {
    labels: Object.keys(ageCounts),
    datasets: [
      {
        label: "Age Distribution",
        data: Object.values(ageCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#F77825",
          "#F3A712",
          "#6B8E23",
        ], // Customize colors as needed
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the chart
  const genderChartData = {
    labels: Object.keys(genderCounts),
    datasets: [
      {
        label: "Gender Distribution",
        data: Object.values(genderCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], // Customize colors as needed
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 1,
      },
    ],
  };

  const genderChartOptions = {
    plugins: {
      legend: {
        position: "left", // Position legend to the left
        align: "start", // Align the legend to the start (top) of the chart
        labels: {
          boxWidth: 10, // Adjust box width if needed
        },
      },
    },
    // layout: {
    //   padding: {
    //     left: 200, // Add padding to make space for the legend
    //   },
    // },
  };

  const ageChartOptions = {
    plugins: {
      legend: {
        position: "left", // Position legend to the left
        align: "start", // Align the legend to the start (top) of the chart
        labels: {
          boxWidth: 10, // Adjust box width if needed
        },
      },
    },
    // layout: {
    //   padding: {
    //     left: 200, // Add padding to make space for the legend
    //   },
    // },
  };

  // Prepare data for the chart
  const ligayaClassData = {
    legend: {
      position: "left", // Position legend to the left
      align: "start", // Align the legend to the start (top) of the chart
      labels: {
        boxWidth: 10, // Adjust box width if needed
      },
    },

    labels: Object.keys(ligayaClassCounts),
    datasets: [
      {
        label: "Liagaya Class Distribution",
        data: Object.values(ligayaClassCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], // Customize colors as needed
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 1,
      },
    ],
  };

  const ligayaClassOptions = {
    plugins: {
      legend: {
        position: "left", // Position legend to the left
        align: "start", // Align the legend to the start (top) of the chart
        labels: {
          boxWidth: 10, // Adjust box width if needed
        },
      },
    },
    // layout: {
    //   padding: {
    //     left: 200, // Add padding to make space for the legend
    //   },
    // },
  };

  return (
    <div className="px-4 py-6 sm:px-6">
      <h3 className="text-base font-semibold leading-7 text-gray-900">
        Demographics
      </h3>
      {/* Grid container for responsive layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {/* Chart 1 */}
        <div className="overflow-hidden bg-white shadow sm:rounded-lg p-6 flex flex-col items-center">
          <h3 className="text-base font-semibold leading-7 text-gray-900 text-center mb-4">
            Gender Distribution
          </h3>
          <div className="border-t border-gray-100 w-full flex items-center justify-center">
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                {" "}
                {/* Space for legend */}
                <Pie data={genderChartData} options={genderChartOptions} />
              </div>
              <div className="flex-grow">{/* Chart content */}</div>
            </div>
          </div>
        </div>
        {/* Chart 2 */}
        <div className="overflow-hidden bg-white shadow sm:rounded-lg p-6 flex flex-col items-center">
          <h3 className="text-base font-semibold leading-7 text-gray-900 text-center mb-4">
            Age Distribution
          </h3>
          <div className="border-t border-gray-100 w-full flex items-center justify-center">
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                {" "}
                {/* Space for legend */}
                <Pie data={ageChartData} options={ageChartOptions} />
              </div>
              <div className="flex-grow">{/* Chart content */}</div>
            </div>
          </div>
        </div>
        {/* Chart 3 */}
        <div className="overflow-hidden bg-white shadow sm:rounded-lg p-6 flex flex-col items-center">
          <h3 className="text-base font-semibold leading-7 text-gray-900 text-center mb-4">
            Ligaya Status Distribution
          </h3>
          <div className="border-t border-gray-100 w-full flex items-center justify-center">
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                {" "}
                {/* Space for legend */}
                {/* Placeholder or chart */}
                <Pie data={ligayaClassData} options={ligayaClassOptions} />
              </div>
              <div className="flex-grow">{/* Chart content */}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
