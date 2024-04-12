import "./Users.css";
import React, { useState } from "react";

import { Grid, TextField } from "@mui/material";

import UserCard from "./UserCard";

const Users = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <TextField
        label="Search User by Name or Username"
        size="small"
        autoFocus={true}
        className="search-user"
        color="primary"
        variant="outlined"
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <Grid
        container
        direction="row"
        columnSpacing={3}
        rowSpacing={2}
        sx={{ padding: "30px" }}
      >
        {filteredUsers.length === 0 && (
          <h2 style={{ width: "100%", textAlign: "center" }}>User not found</h2>
        )}
        {filteredUsers.map((user, index) => (
          <UserCard key={index} user={user} />
        ))}
      </Grid>
    </>
  );
};

export default Users;