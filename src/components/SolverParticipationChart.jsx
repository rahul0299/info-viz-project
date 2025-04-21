import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label
} from "recharts";

const SolverParticipationChart = ({ data }) => {

    const sortedData = [...data].sort((a, b) => b.participation_pct - a.participation_pct);

    return data.length > 0
      ?
      <>
          <h3>Solver Participation % in Auctions</h3>
          <ResponsiveContainer width="100%" height="100%">
              {/*<BarChart*/}
              {/*    data={data}*/}
              {/*    margin={{ top: 0, right: 0, left: 0, bottom: 30 }}*/}
              {/*>*/}
              {/*    <CartesianGrid strokeDasharray="3 3" />*/}
              {/*    <XAxis*/}
              {/*        dataKey="name"*/}
              {/*        angle={-45}*/}
              {/*        textAnchor="end"*/}
              {/*        interval={0}*/}
              {/*        tick={{ fontSize: 10 }}*/}
              {/*    />*/}
              {/*    <YAxis domain={[0, 100]} label={{ value: 'Participation %', angle: -90, position: 'insideLeft' }} />*/}
              {/*    <Tooltip />*/}
              {/*    <Bar dataKey="participation_pct" fill="#8884d8" isAnimationActive={true} />*/}
              {/*</BarChart>*/}

              <BarChart
                  data={sortedData}
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 0, bottom: 12 }}
              >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                      type="number"
                      domain={[0, 100]}
                      label={{ value: 'Participation %', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
                      interval={0}
                      tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar dataKey="participation_pct" fill="#8884d8" isAnimationActive={true} />
              </BarChart>
          </ResponsiveContainer>
      </>
      :
      <>No data available.</>
  ;
};

export default SolverParticipationChart;
