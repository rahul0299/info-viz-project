import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label
} from "recharts";

const SolverParticipationChart = ({ data }) => {
  return data.length > 0
      ?
      <ResponsiveContainer width="100%" height="100%">
          <BarChart
              data={data}
              margin={{ top: 0, right: 0, left: 0, bottom: 30 }}
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
