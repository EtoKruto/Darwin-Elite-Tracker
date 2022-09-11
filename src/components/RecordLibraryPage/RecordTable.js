import * as React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import useTheme from "@mui/material/styles/useTheme";
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
import TableHead from "@mui/material/TableHead";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import useGlobalContext from "../../context/GlobalContext";
import dataDecipher from "../../helpers/dataDecipher";
import firebaseCodes from "../../helpers/firebaseErrorCodes";
import { toast } from "react-toastify";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  function handleFirstPageButtonClick(event) {
    onPageChange(event, 0);
  }
  function handleBackButtonClick(event) {
    onPageChange(event, page - 1);
  }
  function handleNextButtonClick(event) {
    onPageChange(event, page + 1);
  }
  function handleLastPageButtonClick(event) {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  }
  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
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
        aria-label="next page"
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
        aria-label="last page"
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

export default function RecordTable({
  tableData,
  setShowEditModal,
  setEditRow,
}) {
  const { setUserProblemArray, toastifyTheme } = useGlobalContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;
  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  function handleEditClick(data, idx) {
    setEditRow(data);
    setShowEditModal(true);
  }

  function handleDeleteClick(problem_id) {
    axios
      .delete(`/records/${problem_id}`, {
        params: {
          userID: sessionStorage.getItem("UserID"),
        },
      })
      .then(() => {
        axios
          .get("/records", {
            params: {
              userID: sessionStorage.getItem("UserID"),
            },
          })
          .then(({ data }) => {
            const setUserData = dataDecipher(data);
            setUserProblemArray(
              setUserData[1].sort((prompt1, prompt2) =>
                prompt1.timeStamp.localeCompare(prompt2.timeStamp)
              )
            );
            toast.success("Problem Removed", toastifyTheme);
          });
      })
      .catch((error) => {
        firebaseCodes(error.response.data.code, toastifyTheme);
      });
  }
  function millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  return (
    <TableContainer
      sx={{
        width: "80%",
        mb: 2,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
      }}
      component={Paper}
    >
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell>Prompt Name</TableCell>
            <TableCell>Date Submitted</TableCell>
            <TableCell>Prompt Link</TableCell>
            <TableCell align="right">Difficulty</TableCell>
            <TableCell align="right">Time to Complete (mm:ss)</TableCell>
            <TableCell align="right">Edit</TableCell>
            <TableCell align="right">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? tableData.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : tableData
          ).map((row, idx) => (
            <TableRow id={idx} key={idx}>
              <TableCell style={{ width: 200 }}>{row.promptName}</TableCell>
              <TableCell style={{ width: 200 }}>
                {`${new Date(row.timeStamp).getMonth() + 1}/${new Date(
                  row.timeStamp
                ).getDate()}/${new Date(row.timeStamp).getFullYear()}`}
              </TableCell>
              <TableCell>
                <a
                  href={row.promptLink}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="prompt-link"
                >
                  {row.promptLink.length > 25
                    ? `${row.promptLink.slice(0, 25)}...`
                    : row.promptLink}
                </a>
              </TableCell>
              <TableCell style={{ width: 90 }} align="right">
                {row.difficulty}
              </TableCell>
              <TableCell style={{ width: 95 }} align="right">
                {millisToMinutesAndSeconds(row.totalTime)}
              </TableCell>
              <TableCell style={{ width: 72 }} align="right">
                <IconButton onClick={() => handleEditClick(row, idx)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell style={{ width: 73 }} align="right">
                <IconButton onClick={() => handleDeleteClick(row.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 73 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={6}
              count={tableData.length}
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
