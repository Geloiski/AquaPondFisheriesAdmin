import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

import { collection, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { Button, TableHead } from "@mui/material";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function Shops() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [userData, setUserData] = React.useState([]);
  const [shopData, setShopData] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  userData.sort((a, b) => (a.calories < b.calories ? -1 : 1));
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userData.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  React.useEffect(() => {
    const q = query(collection(db, "users"), where("hasShop", "==", true));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          data: doc.data()
        });
      });
      for (let index = 0; index < data.length; index++) {
        const shopQuery = query(collection(db, "users", data[index].id, "shop"));
        onSnapshot(shopQuery, (querySnapshot) => {
          const shopData = [];
          querySnapshot.forEach((doc) => {
            shopData.push({
              id: doc.id,
              ownerName: doc.data().fullName,
              shopName: doc.data().businessName,
              phone: doc.data().contactNo,
              dateCreated: doc.data().dateCreated,
              location: doc.data().shopLocation,
              isVerified: doc.data().isShopVerified === true ? "Yes" : "No",
              ownerID: doc.data().userID,
            });
          });
          setShopData(shopData);
          console.log(shopData);
        });
      }
      setUserData(data);
    });
    return unsubscribe;
  }, [navigate]);

  const handleVerify = async (ownerID, shopID) => {
    const shopQuery = doc(db, "users", ownerID, "shop", shopID);
    await setDoc(shopQuery, {
      isShopVerified: true
    }, { merge: true }
    )
  }

  const handleReject = async (ownerID, shopID) => {
    const shopQuery = doc(db, "users", ownerID, "shop", shopID);
    await setDoc(shopQuery, {
      isShopVerified: false
    }, { merge: true }
    )
  }

  const handleView = async (ownerID, shopID) => {
    const shopQuery = doc(db, "users", ownerID, "shop", shopID);
    await setDoc(shopQuery, {
      isShopVerified: true
    }, { merge: true }
    )
  }

  const handleDelete = async (ownerID, shopID) => {
    const shopQuery = doc(db, "users", ownerID, "shop", shopID);
    await setDoc(shopQuery, {
      isShopVerified: false
    }, { merge: true }
    )
  }
  return (
    <TableContainer
      component={Paper}
      sx={{ minHeight: "85vh", boxShadow: 2, border: 2 }}
    >
      <Table sx={{ minWidth: 500 }} aria-label='custom pagination table'>
        <TableHead>
          <TableRow sx={{ fontWeigth: 700 }}>
            <TableCell>ID</TableCell>
            <TableCell align='center'>Owner Name</TableCell>
            <TableCell align='center'>Shop Name</TableCell>
            <TableCell align='center'>Phone</TableCell>
            <TableCell align='center'>Date Created</TableCell>
            <TableCell align='center'>Location</TableCell>
            <TableCell align='center'>Is Verified</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? shopData.slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage
            )
            : shopData
          ).map((row) => (
            <TableRow key={row.id} >
              <TableCell component='th' scope='row' align='left' style={{ width: 160 }}>
                {row.id}
              </TableCell>
              <TableCell style={{ width: 160 }} align='center'>
                {row.ownerName}
              </TableCell>
              <TableCell style={{ width: 160 }} align='center'>
                {row.shopName}
              </TableCell>
              <TableCell style={{ width: 160 }} align='center'>
                {row.phone}
              </TableCell>
              <TableCell style={{ width: 160 }} align='center'>
                {moment(row.dateCreated).format("MMM Do YY")}
              </TableCell>
              <TableCell style={{ width: 160 }} align='center'>
                {row.location}
              </TableCell>
              <TableCell style={{ width: 160 }} align='center'>
                {row.isVerified}
              </TableCell>
              <TableCell style={{ width: 160 }} align='center'>
                <Box sx={{ display: 'flex', flexDirection: row, justifyContent: 'space-evenly' }}>
                  {row.isVerified === "Yes" ?
                    <>
                      <Button variant='contained' color="success" onClick={() => handleView(row.ownerID, row.id)}>View</Button>
                      <Button variant='contained' color="error" onClick={() => handleDelete(row.ownerID, row.id)}>Delete</Button>
                    </> :
                    <>
                      <Button variant='contained' color="success" onClick={() => handleVerify(row.ownerID, row.id)}>Verify</Button>
                      <Button variant='contained' color="error" onClick={() => handleReject(row.ownerID, row.id)}>Reject</Button>
                    </>
                  }
                </Box>
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={6}
              count={shopData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
