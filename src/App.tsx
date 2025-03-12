import './App.css'

function App() { // start bilding your popup app here 
  return (
    <SummaryCard 
      title="Summary" 
      content="This is a custom summary content that can be changed dynamically." 
      points={[
        "First key point",
        "Second key detail",
        "Final recommendation"
      ]}
    />
  )
}

interface SummaryCardProps {
  title?: string;
  content: string;
  points?: string[];
}

const SummaryCard = ({ title = "Summary", content, points = [] }: SummaryCardProps) => {
  return (
    <div className="w-[540px] h-auto text-[14px] mx-auto rounded-lg shadow-md overflow-hidden bg-white">
      <div className="bg-sky-100 pb-4 p-4">
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      <div className="p-6">
        <p className="text-muted-foreground">{content}</p>
        <ul className="mt-4 space-y-2">
          {points.map((point, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default App
