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

import { collection, deleteDoc, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { Button, CircularProgress, Grid, LinearProgress, Stack, TableHead } from "@mui/material";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";
import ShopSingleView from "./singleViews/ShopSingleView";

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
  const [isLoading, setIsLoading] = React.useState(false);
  const [isClicked, setIsClicked] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [userData, setUserData] = React.useState([]);
  const [shopData, setShopData] = React.useState([]);
  const [selectedData, setSelectedData] = React.useState({});
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
    setIsLoading(true);
    const q = query(collection(db, "shops"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          data: doc.data()
        })
      });
      setShopData(data);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [navigate])

  const handleVerify = async (ownerID, shopID) => {
    const shopQuery = doc(db, "users", ownerID, "shop", shopID);
    await setDoc(shopQuery, {
      isShopVerified: true
    }, { merge: true }
    ).then(async () => {
      const shopsQuery = doc(db, "shops", shopID);
      await setDoc(shopsQuery, {
        isShopVerified: true
      }, { merge: true }
      )
    })
  }

  const handleReject = async (ownerID, shopID) => {
    const shopQuery = doc(db, "users", ownerID, "shop", shopID);
    await setDoc(shopQuery, {
      isShopVerified: false
    }, { merge: true }
    )
  }

  const handleView = (ownerID, shopID) => {
    setIsClicked(true)
    const shopQuery = doc(db, "users", ownerID, "shop", shopID);
    onSnapshot(shopQuery, (doc) => {
      setSelectedData({ id: shopID, data: doc.data() });
    })
  }
  console.log(selectedData);
  const handleDelete = (ownerID, shopID) => {
    deleteDoc(doc(db, "users", ownerID, "shop", shopID)).then(async () => {
      const userQuery = doc(db, "users", ownerID);
      await setDoc(userQuery, {
        isShopVerified: false
      }, { merge: true }
      ).then(() => {
        deleteDoc(doc(db, "shops", shopID))
      })
    })
  }
  return (
    <TableContainer
      component={Paper}
      sx={{ minHeight: "85vh", boxShadow: 2, border: 2 }}
    >
      {isLoading ?
        <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
          <LinearProgress color="secondary" />
        </Stack>
        : <>
          {isClicked === true ?
            <Box sx={{ minHeight: "85vh", boxShadow: 2, border: 2 }}>
              <ShopSingleView data={selectedData} />
            </Box>
            : <>
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
                  ).map(({ data, id }) => (
                    <TableRow key={id} >
                      <TableCell component='th' scope='row' align='left' style={{ width: 160 }}>
                        {id}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align='center'>
                        {data.fullName}
                      </TableCell>
                      <TableCell style={{ width: 200 }} align='center'>
                        {data.businessName}
                      </TableCell>
                      <TableCell style={{ width: 160, fontStyle: 'italic', color: 'blue' }} align='center'>
                        {data.contactNo}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align='center'>
                        {
                          moment(data.dateCreated).format("ll")
                        }
                      </TableCell>
                      <TableCell style={{ width: 200 }} align='center'>
                        {data.shopLocation}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align='center'>
                        {data.isShopVerified === false ? 'false' : 'true'}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align='center'>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                          {data.isShopVerified === true ?
                            <>
                              <Button variant='contained' color="info" onClick={() => handleView(data.userID, id)}>View</Button>
                              <Button variant='contained' color="error" onClick={() => handleDelete(data.userID, id)} sx={{ marginLeft: 1 }}>Delete</Button>
                            </> :
                            <>
                              <Button variant='contained' color="info" onClick={() => handleView(data.userID, id)}>View</Button>
                              <Button variant='contained' color="success" onClick={() => handleVerify(data.userID, id)} sx={{ marginLeft: 1 }}>Verify</Button>
                              <Button variant='contained' color="error" onClick={() => handleReject(data.userID, id)} sx={{ marginLeft: 1 }}>Reject</Button>
                            </>
                          }
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 55 * emptyRows }}>
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
            </>
          }
        </>
      }
    </TableContainer >
  );
}
