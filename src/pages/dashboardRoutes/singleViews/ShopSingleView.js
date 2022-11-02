import { Typography, Box, Image } from "@mui/material";
import React, { useEffect } from "react";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
function ShopSingleView({ data }) {
    return (
        <Box>
            < Typography variant='h4' >ShopID: {data.id}</Typography >
            < Typography variant='h4' >Shop name: {data.data.businessName}</Typography >
            < Typography variant='h4' > OwnerName:{data.data.fullName}</Typography >
            < Typography variant='h4' >Address: {data.data.address}</Typography >
            < Typography variant='h4' >Email: {data.data.email}</Typography >
            < Typography variant='h4' >Phone: {data.data.contactNo}</Typography >
            <img src={data.data.imageShop} alt={"Profile Photo: " + data.shopName} />
            < Typography variant='h4' >DateCreated: {data.data.dateCreated}</Typography >
            < Typography variant='h4' >isShopVerified: {data.data.isShopVerified === true ? "Yes" : "No"}</Typography >
        </Box>);
}

export default ShopSingleView;
