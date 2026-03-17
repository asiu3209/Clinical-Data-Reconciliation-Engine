export interface DataQualityCardProp {
  title: String;
  score: number;
}

export default function DataQualityCard(data: DataQualityCardProp) {
  // Determine color based on score
  const getColor = () => {
    if (data.score >= 80) return "bg-green-500";
    if (data.score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-medium capitalize">{data.title}</h3>
        <span className="text-sm font-semibold">{data.score}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-500`}
          style={{ width: `${data.score}%` }}
        />
      </div>
    </div>
  );
}
