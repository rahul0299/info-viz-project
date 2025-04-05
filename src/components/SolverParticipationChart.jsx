import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label
} from "recharts";

const SolverParticipationChart = ({ data }) => {
  return data.length > 0
      ?
      <ResponsiveContainer width="100%" height={400}>
          <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 30, bottom: 80 }}
          >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 10 }}
              />
              <YAxis domain={[0, 100]} label={{ value: 'Participation %', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="participation_pct" fill="#8884d8" isAnimationActive={true} />
          </BarChart>
      </ResponsiveContainer>
      :
      <>No data available.</>
  ;
};

export default SolverParticipationChart;
