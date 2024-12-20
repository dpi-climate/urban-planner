import React, { useState } from "react"
import BarChart from "../bar-chart/BarChart"
import LineChart from "../line-chart/LineChart"

const App: React.FC = () => {
  const [data1, setData1] = useState([
    { category: "A", value: 30 },
    { category: "B", value: 50 },
    { category: "C", value: 80 },
  ])

  const updateData1 = () => {
    setData1((prevData) => [
      ...prevData,
      { category: `D${prevData.length}`, value: Math.random() * 100 },
    ])
  }

  const [data2, setData2] = useState([
    { date: new Date(2023, 0, 1), value: 30 },
    { date: new Date(2023, 1, 1), value: 50 },
    { date: new Date(2023, 2, 1), value: 80 },
  ])

  const updateData2 = () => {
    setData2((prevData) => [
      ...prevData,
      { date: new Date(2023, prevData.length, 1), value: Math.random() * 100 },
    ])
  }

  return (
    <>
    <div>
      <h1>Dynamic Bar Chart</h1>
      <BarChart data={data1} width={600} height={400} />
      <button onClick={updateData1}>Update Data</button>
    </div>
    <div>
      <h1>Dynamic Bar Chart</h1>
      <LineChart data={data2} width={600} height={400} />
    </div>
    </>
  )
}

export default App
