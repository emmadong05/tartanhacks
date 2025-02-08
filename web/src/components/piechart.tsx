import { Pie } from "react-chartjs-2";
// Import and register the required Chart.js components
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

type Metric = {
  _id: string;
  tag: string; // name
  count: number;
};

const PieChart = ({ metrics }: { metrics: Metric[] }) => {
  // Extract labels and data values from metrics
  const labels = metrics.map((metric) => metric.tag);
  const dataValues = metrics.map((metric) => metric.count);

  // Define a deep-ocean green/blue palette.
  // The 'pastel' color uses 50% opacity for a softer fill.
  // The 'border' color is fully opaque.
  const colorPalette = [
    { pastel: "rgba(125, 211, 252, 0.5)", border: "rgba(125, 211, 252, 1)" }, // Light Sky Blue
    { pastel: "rgba(6, 182, 212, 0.5)", border: "rgba(6, 182, 212, 1)" }, // Bright Cyan
    { pastel: "rgba(20, 148, 115, 0.5)", border: "rgba(20, 148, 115, 1)" }, // Rich Teal
    { pastel: "rgba(110, 231, 183, 0.5)", border: "rgba(110, 231, 183, 1)" }, // Deep Teal Green
  ];

  // Map the colors to each metric.
  // If there are more metrics than colors, the palette will repeat.
  const backgroundColors = metrics.map(
    (_: Metric, index: number) =>
      colorPalette[index % colorPalette.length].pastel
  );
  const borderColors = metrics.map(
    (_: Metric, index: number) =>
      colorPalette[index % colorPalette.length].border
  );

  // Prepare the data for the Pie component
  const data = {
    labels,
    datasets: [
      {
        label: "Watched",
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 3, // Bold borders for each slice
      },
    ],
  };

  // Optionally, you can customize options for the pie chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 12,
            color: "white",
          },
          color: "#d0d0d0",
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Pie data={data} options={options as any} />;
};

export default PieChart;
