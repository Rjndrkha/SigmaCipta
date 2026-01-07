import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface PieChartProps {
  labels: string[];
  data: number[];
  colors?: string[];
  title?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  labels,
  data,
  colors = ["#FF6384", "#FFCE56"],
  title = "Pie Chart Example",
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        hoverBackgroundColor: colors.map((color) => color + "AA"),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
  };

  return (
    <div className="w-fit h-fit">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
