import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
// import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const [state, setState] = useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  // List for Drawer (same links as desktop)
  const drawerList = () => (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer('right', false)} onKeyDown={toggleDrawer('right', false)} >
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/record">
            <ListItemText primary="Record" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/notes">
            <ListItemText primary="Saved Notes" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Voice Annotator</h1>

      {/* Desktop Navigation */}
      <div className="space-x-4 pr-4 hidden sm:flex">
        <Link to="/" className="hover:text-blue-400">Home</Link>
        <Link to="/record" className="hover:text-blue-400">Record</Link>
        <Link to="/notes" className="hover:text-blue-400">Saved Notes</Link>
      </div>

      {/* Mobile Navigation  */}
      <div className="block sm:hidden">
        <Button variant="contained" onClick={toggleDrawer('right', true)}>
          <MenuIcon/>
        </Button>
        <SwipeableDrawer anchor="right" open={state.right} onClose={toggleDrawer('right', false)} onOpen={toggleDrawer('right', true)} >
          {drawerList()}
        </SwipeableDrawer>
      </div>
    </nav>
  );
};

export default Navbar;
