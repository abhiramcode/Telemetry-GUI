import React from 'react';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Box, Tooltip, Typography, List, ListItem, ListItemText } from '@mui/material';

const alertsList = [
  "Battery below 20%",
  "No GPS Fix",
  "RC signal lost"
];

const SystemAlerts = ({ alerts = alertsList }) => (
  <Tooltip
    title={
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 0 }}>⚠️ System Alerts</Typography>
        <List dense sx={{ p: 0, minWidth: 180 }}>
          {alerts.map((alert, i) => (
            <ListItem key={i} sx={{ py: 0 }}>
              <ListItemText
                primary={alert}
                primaryTypographyProps={{ variant: 'caption', color: 'error' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    }
    arrow
    placement="bottom-start"
  >
    <Box sx={{ cursor: "pointer", color: "#f44336", display: 'flex', alignItems: 'center', mr: -1 }}>
      <NotificationsNoneIcon />
    </Box>
  </Tooltip>
);

export default SystemAlerts;