import { Typography, Box, Image } from "@mui/material";
import React, { useEffect } from "react";
import { getStorage, reffrom, getDownloadURL } from "firebase/storage";
function SingleView({ data }) {

  return (
    <Box>
      < Typography variant='h1' >ID: {data.ownerId}</Typography >
      < Typography variant='h1' > FullNAme:{data.fullname}</Typography >
      < Typography variant='h1' >ADD: {data.address}</Typography >
      < Typography variant='h1' >Email: {data.email}</Typography >
      < Typography variant='h1' >Phone: {data.phone}</Typography >
      <img src={data.photoURL} alt={"Profile Photo: " + data.fullname}/>
      < Typography variant='h1' >ShopID: {data.shopID}</Typography >
    </Box>);
}

export default SingleView;
