import { Grid, Paper, Typography } from "@mui/material";
import React from "react";
import PeopleIcon from "@mui/icons-material/People";
import StoreIcon from "@mui/icons-material/Store";
import Users from "./Users";
function MainDashboard() {
  const data = [
    {
      id: 0,
      label: "No. of Users",
      totalData: 0,
      icon: <PeopleIcon />,
    },
    {
      id: 1,
      label: "No. of Shop",
      totalData: 0,
      icon: <StoreIcon />,
    },
    {
      id: 2,
      label: "No. of Users",
      totalData: 0,
      icon: <PeopleIcon />,
    },
  ];
  return (
    <Grid item xs={12}>
      <Grid container justifyContent='center' spacing={8}>
        {data.map((value) => (
          <Grid key={value.id} item>
            <Paper
              sx={{
                height: 120,
                width: 270,
                backgroundColor: "#1A2027",
                p: 2,
              }}
            >
              <Typography sx={{ color: "#fff", fontSize: 30 }}>
                {value.label}
              </Typography>
              <Typography sx={{ color: "#fff", fontSize: 36, float: "right" }}>
                {value.totalData}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Users />
    </Grid>
  );
}

export default MainDashboard;
