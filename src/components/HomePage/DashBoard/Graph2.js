/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import ReactEcharts from "echarts-for-react";
import { Box, Stack } from "@mui/material";
import MenuBar from "./MenuBar.js";
import Settings from "./SettingsPopOver";
import moment from "moment";
import useGlobalContext from "../../../context/GlobalContext.js";

export default function Line() {
  const { userProblemArray } = useGlobalContext();
  const [graph, setGraph] = React.useState("totalQuantities");
  const [selection, setSelection] = React.useState("difficulty");
  const [subject, setSubject] = React.useState([]);
  const [input, setInput] = React.useState([]);
  const [time, setTime] = React.useState("whole process");
  const [range, setRange] = React.useState("year");
  const [language, setLanguage] = React.useState("Javascript");
  const [settingsView, setSettingsView] = React.useState(false);
  const [settingsVisible, setSettingsVisible] = React.useState(false);
  // const [legend, setLegend]=React.useState([]);  TODO: add legend

  const handleTime = (event: SelectChangeEvent) => {
    setTime(event.target.value);
  };
  const handleRange = (event: SelectChangeEvent) => {
    setRange(event.target.value);
  };
  const handleLanguage = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const handleGraph = (event) => {
    setGraph(event.target.value);
  };
  const handleSelection = (event) => {
    setSelection(event.target.value);
    setSubject([]);
  };

  const handleSubject = (event) => {
    setSubject(event.target.value);
  };

  const getLastDate = (x) => {
    const now = new Date();
    const result = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - x
    );
    return result.toISOString();
  };

  let lastDate = getLastDate(0);
  let startDate = getLastDate(6);

  React.useEffect(() => {
    let samples = [];

    //filter range
    if (range === "week") {
      for (let i = 0; i < userProblemArray.length; i++) {
        if (
          userProblemArray[i]["timeStamp"] > startDate &&
          userProblemArray[i]["timeStamp"] < lastDate
        ) {
          samples.push(userProblemArray[i]);
        }
      }
    } else if (range === "month") {
      startDate = getLastDate(29);
      for (let i = 0; i < userProblemArray.length; i++) {
        if (
          userProblemArray[i]["timeStamp"] > startDate &&
          userProblemArray[i]["timeStamp"] < lastDate
        ) {
          samples.push(userProblemArray[i]);
        }
      }
    } else if (range === "year") {
      startDate = getLastDate(364);
      for (let i = 0; i < userProblemArray.length; i++) {
        if (
          userProblemArray[i]["timeStamp"] > startDate &&
          userProblemArray[i]["timeStamp"] < lastDate
        ) {
          samples.push(userProblemArray[i]);
        }
      }
    }
    //filter the language
    let sampleUpdate = [];
    for (let i = 0; i < samples.length; i++) {
      if (samples[i]["programmingLanguage"] !== undefined) {
        if (
          samples[i]["programmingLanguage"].toLowerCase() ===
          language.toLowerCase()
        ) {
          sampleUpdate.push(samples[i]);
        }
      }
    }
    //filter graph type(totalQuantities/ aveerge speed) and setting(difficulty/subject)
    if (graph === "totalQuantities" && selection === "subject") {
      let subjectTeam = {};
      for (let i = 0; i < sampleUpdate.length; i++) {
        let sub = sampleUpdate[i]["topics"];
        if (subject.includes(sub)) {
          if (subjectTeam[sub] === undefined) {
            subjectTeam[sub] = [];
            subjectTeam[sub].push(sampleUpdate[i]);
          } else {
            subjectTeam[sub].push(sampleUpdate[i]);
          }
        } else {
          continue;
        }
      }
      let updateFormate = {};
      for (let key in subjectTeam) {
        let timeAndValue = subjectTeam[key];
        let temp = {};
        for (let i = 0; i < timeAndValue.length; i++) {
          let time = timeAndValue[i]["timeStamp"].slice(0, 10);
          if (temp[time] !== undefined) {
            temp[time]++;
          } else {
            temp[time] = 1;
          }
        }
        updateFormate[key] = temp;
      }
      let finalResult = [];
      for (let key in updateFormate) {
        let temp = {};
        temp["name"] = key;
        temp["type"] = "line";
        temp["data"] = [];
        for (let value in updateFormate[key]) {
          let data = [];
          data.push(value);
          data.push(updateFormate[key][value]);
          temp["data"].push(data);
        }
        finalResult.push(temp);
      }
      let container = [];
      for (let i = 0; i < finalResult.length; i++) {
        container.push(finalResult[i]["name"]);
      }
      //  setLegend(container);  TODO: add legend
      setInput(finalResult);
    }

    if (graph === "totalQuantities" && selection === "difficulty") {
      let subjectTeam = {};
      for (let i = 0; i < sampleUpdate.length; i++) {
        let sub = sampleUpdate[i]["difficulty"];
        if (subjectTeam[sub] === undefined) {
          subjectTeam[sub] = [];
          subjectTeam[sub].push(sampleUpdate[i]);
        } else {
          subjectTeam[sub].push(sampleUpdate[i]);
        }
      }
      let updateFormate = {};
      for (let key in subjectTeam) {
        let timeAndValue = subjectTeam[key];
        let temp = {};
        for (let i = 0; i < timeAndValue.length; i++) {
          let time = timeAndValue[i]["timeStamp"].slice(0, 10);
          if (temp[time] !== undefined) {
            temp[time]++;
          } else {
            temp[time] = 1;
          }
        }
        updateFormate[key] = temp;
      }
      let finalResult = [];
      for (let key in updateFormate) {
        let temp = {};
        temp["name"] = key;
        temp["type"] = "line";
        temp["data"] = [];
        for (let value in updateFormate[key]) {
          let data = [];
          data.push(value);
          data.push(updateFormate[key][value]);
          temp["data"].push(data);
        }
        finalResult.push(temp);
      }
      let containerB = [];
      for (let i = 0; i < finalResult.length; i++) {
        containerB.push(finalResult[i]["name"]);
      }
      //  setLegend(containerB);  TODO: add legend
      setInput(finalResult);
    }

    if (graph === "totalTime" && selection === "subject") {
      let subjectTeam = {};
      for (let i = 0; i < sampleUpdate.length; i++) {
        let sub = sampleUpdate[i]["topics"];
        if (subject.includes(sub)) {
          if (subjectTeam[sub] === undefined) {
            subjectTeam[sub] = [];
            subjectTeam[sub].push(sampleUpdate[i]);
          } else {
            subjectTeam[sub].push(sampleUpdate[i]);
          }
        }
      }
      //format now {'tree':[date1, data2...], 'hash':[dateI,daataII.....]...}
      let updateFormate = {};
      for (let key in subjectTeam) {
        let timeAndValue = subjectTeam[key];
        let temp = {};
        for (let i = 0; i < timeAndValue.length; i++) {
          let time = timeAndValue[i]["timeStamp"].slice(0, 10);
          if (temp[time] !== undefined) {
            temp[time] =
              (temp[time] + Number(timeAndValue[i]["totalTime"]) / 1000 / 60) /
              2;
          } else {
            temp[time] = Number(timeAndValue[i]["totalTime"]) / 1000 / 60;
          }
        }
        updateFormate[key] = temp;
      }

      let finalResult = [];
      for (let key in updateFormate) {
        let temp = {};
        temp["name"] = key;
        temp["type"] = "line";
        temp["data"] = [];
        for (let value in updateFormate[key]) {
          let data = [];
          data.push(value);
          data.push(updateFormate[key][value]);
          temp["data"].push(data);
        }
        finalResult.push(temp);
      }
      let containerC = [];
      for (let i = 0; i < finalResult.length; i++) {
        containerC.push(finalResult[i]["name"]);
      }
      //  setLegend(containerC);  TODO: add legend
      setInput(finalResult);
    }

    if (graph === "totalTime" && selection === "difficulty") {
      let subjectTeam = {};
      for (let i = 0; i < sampleUpdate.length; i++) {
        let sub = sampleUpdate[i]["difficulty"];
        if (subjectTeam[sub] === undefined) {
          subjectTeam[sub] = [];
          subjectTeam[sub].push(sampleUpdate[i]);
        } else {
          subjectTeam[sub].push(sampleUpdate[i]);
        }
      }
      let updateFormate = {};
      for (let key in subjectTeam) {
        let timeAndValue = subjectTeam[key];
        let temp = {};
        for (let i = 0; i < timeAndValue.length; i++) {
          let time = timeAndValue[i]["timeStamp"].slice(0, 10);
          if (temp[time] !== undefined) {
            temp[time] =
              (temp[time] + Number(timeAndValue[i]["totalTime"]) / 1000 / 60) /
              2;
          } else {
            temp[time] = Number(timeAndValue[i]["totalTime"]) / 1000 / 60;
          }
        }
        updateFormate[key] = temp;
      }

      let finalResult = [];
      for (let key in updateFormate) {
        let temp = {};
        temp["name"] = key;
        temp["type"] = "line";
        temp["data"] = [];
        for (let value in updateFormate[key]) {
          let data = [];
          data.push(value);
          data.push(updateFormate[key][value]);
          temp["data"].push(data);
        }
        finalResult.push(temp);
      }
      let containerD = [];
      for (let i = 0; i < finalResult.length; i++) {
        containerD.push(finalResult[i]["name"]);
      }
      //  setLegend(containerD);  TODO: add legend
      setInput(finalResult);
    }
  }, [graph, selection, subject, time, language, range, userProblemArray]);

  const option = {
    title: {
      text:
        graph === "totalTime"
          ? "Speed (mins)"
          : graph === "totalQuantities"
          ? "Total"
          : null,
      padding: [20, 5, 5, 5],
      textStyle: {
        color: "white",
      },
    },
    textStyle: {
      color: function (value, index) {
        return "white";
      },
      fontWeight: "bold",
    },
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      top: "20%",
      bottom: "1%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "time",
      boundaryGap: false,
      axisLabel: {
        formatter: function (value) {
          return moment(value).format("MM/DD");
        },
        hideOverlap: true,
      },
    },
    yAxis: {
      show: false,
    },
    series: input,
  };
  return (
    <Stack
      sx={{ alignItems: "start" }}
      direction="row"
      onMouseLeave={() => {
        setSettingsVisible(false);
      }}
      onMouseEnter={() => {
        setSettingsVisible(true);
      }}
    >
      {!settingsView ? (
        <Box
          sx={{
            "&:hover": { boxShadow: 3 },
            width: "270px",
            height: "300px",
            ml: 4,
            mr: 4,
            mt: 1,
            mb: 2,
          }}
          onMouseEnter={() => {
            setSettingsVisible(true);
          }}
        >
          <ReactEcharts
            sx={{
              "&:hover": { boxShadow: 3 },
              width: "270px",
              height: "300px",
              ml: 4,
              mr: 4,
              mt: 1,
              mb: 2,
            }}
            option={option}
          />
        </Box>
      ) : (
        <MenuBar
          pagraph={graph}
          setGraph={setGraph}
          subject={subject}
          handleSubject={handleSubject}
          selection={selection}
          setSelection={setSelection}
          time={time}
          range={range}
          language={language}
          handleRange={handleRange}
          handleLanguage={handleLanguage}
          handleTime={handleTime}
          handleGraph={handleGraph}
          handleSelection={handleSelection}
        />
      )}
      <Settings
        setSettingsView={setSettingsView}
        settingsView={settingsView}
        settingsVisible={settingsVisible}
      ></Settings>
    </Stack>
  );
}
